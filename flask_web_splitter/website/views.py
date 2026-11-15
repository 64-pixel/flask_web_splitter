from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Note
from .models import Split
from datetime import datetime
from . import db
import json

views = Blueprint('views', __name__)

@views.route('/split_items', methods=['GET', 'POST'])
@login_required
def split_items():
    
    if request.method == 'POST':
        item = request.form.get('item')
        total_amount = request.form.get('total_amount')
        number_people = request.form.get('number_people')
        budget = request.form.get('budget')
        due_date=request.form.get('due_date')

        if due_date:
            due_date = datetime.strptime(due_date, '%Y-%m-%d').date()
        else:
            due_date=None
        

        new_split = Split(
            item=item,
            total_amount=float(total_amount),
            number_people=float(number_people),
            budget=float(budget),
            user_id=current_user.id,
            due_date=due_date
            
        )

        db.session.add(new_split)
        db.session.commit()

    splits = Split.query.filter_by(user_id=current_user.id, is_deleted=False).all()
        
    return render_template('split_items.html', user=current_user, splits=splits)

@views.route('/update-bill', methods=['POST'])
@login_required
def update():
    data=request.get_json()

    split=Split.query.filter_by(
        id=data.get('id'),
        user_id=current_user.id
    ).first()

    if not split:
        return jsonify({'error': 'Item not found'}), 404

    try:
        split.item=data['item']
        split.total_amount=int(data['total_amount'])
        split.number_people=int(data['number_people'])
        split.budget=int(data['budget'])
        due_date=data.get('due_date')

        if due_date:
            split.due_date= datetime.strptime(due_date, '%Y-%m-%d').date()
        else:
            split.due_date = None

        db.session.commit()
    except(KeyError, TypeError, ValueError):
        return jsonify({'error': 'Invalid data'}), 400

    return jsonify({'success':True})


@views.route('/bin', methods=['GET', 'POST'])
@login_required
def bin():
    splits = Split.query.filter_by(user_id=current_user.id, is_deleted=True).all()
    notes = Note.query.filter_by(user_id=current_user.id, is_deleted=True).all()
    

    return render_template('bin.html', user=current_user, splits=splits, notes=notes)


@views.route('/notes', methods=['GET', 'POST'])
@login_required
def notes():
    
    if request.method == 'POST':
        note = request.form.get('note')

        if len(note) < 1:
            flash('Note is too short', category='error')

        else:
            new_note = Note(data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
    notes=Note.query.filter_by(user_id=current_user.id, is_deleted=False).all()

    return render_template("notes.html", user=current_user, notes=notes)

@views.route('/delete-item', methods=['POST'])
def delete_item():
    item=json.loads(request.data)
    itemId = item['itemId']
    item = Split.query.filter_by(id=itemId, user_id=current_user.id).first()
    if item:
            item.is_deleted=True
            db.session.commit()
    return jsonify({})

@views.route('/permanently-delete-note', methods=['POST'])
@login_required
def permanently_delete_note():
    note=json.loads(request.data)
    noteId=note['noteId']
    note=Note.query.filter_by(id=noteId, user_id=current_user.id, is_deleted=True).first()
    if note:
        db.session.delete(note)
        db.session.commit()
    return jsonify()

@views.route('/permanently-delete-item', methods=['POST'])
@login_required
def permanently_delete_item():
    item = json.loads(request.data)
    itemId = item['itemId']
    split = Split.query.filter_by(id=itemId, user_id=current_user.id, is_deleted=True).first()

    if split:
        db.session.delete(split)
        db.session.commit()
    return jsonify()

@views.route('/delete-note', methods=['POST'])
@login_required
def delete_note():
    note=json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            note.is_deleted=True
            #db.session.delete(note)
            db.session.commit()

    return jsonify({})

@views.route('/restore-note', methods=['POST'])
@login_required
def restore_note():
    note=json.loads(request.data)
    noteId=note['noteId']

    note = Note.query.filter_by(id=noteId, user_id=current_user.id, is_deleted=True).first()
    if note:
        note.is_deleted=False
        db.session.commit()

    return jsonify({})

@views.route('/restore-item', methods=['POST'])
@login_required
def restore_item():
    item = json.loads(request.data)
    itemId = item['itemId']

    split = Split.query.filter_by(id=itemId, user_id=current_user.id, is_deleted=True).first()

    if split:
        split.is_deleted=False
        db.session.commit()

    return jsonify({})


