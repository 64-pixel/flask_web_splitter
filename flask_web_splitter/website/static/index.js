function deleteNote(noteId){
    fetch('/delete-note', {
        method:'POST',
        body: JSON.stringify({noteId: noteId})
    }).then((_res) => {
        window.location.href = "/bin";
    });
}
function restoreNote(noteId){
    fetch('/restore-note',{
        method:'POST',
        body:JSON.stringify({noteId:noteId})
    }).then((_res) =>{
        window.location.href="/bin";
    })
}
function restoreItem(itemId){
    fetch('/restore-item',{
        method:'POST',
        body:JSON.stringify({itemId:itemId})
    }).then((_res) =>{
        window.location.href="/bin";
    })
}
function permanentlyDeleteItem(itemId){
    fetch('/permanently-delete-item',{
        method:'POST',
        body:JSON.stringify({itemId:itemId})
    }).then((_res)=>{
        window.location.href="/bin";
    })
}
function permanentlyDeleteNote(noteId){
    fetch('/permanently-delete-note',{
        method:'POST',
        body:JSON.stringify({noteId:noteId})
    }).then((_res)=>{
        window.location.href="/bin";
    })
}

function deleteItem(itemId){
    fetch('/delete-item', {
        method:'POST',
        body: JSON.stringify({itemId: itemId})
    }).then((_res) => {
        window.location.href = "/bin";
    });
}

document.addEventListener("DOMContentLoaded", function(){
    const enterButton = document.getElementById("enter-bill")
    const closeButton = document.getElementById("close-modal")
    const modal = document.getElementById("bill-modal")
    if (enterButton && closeButton && modal){
        enterButton.addEventListener("click", function(){
        modal.style.display="block";
        });
        closeButton.addEventListener("click", function() {
            modal.style.display="none";
        });
    }
    

    
const changeButtons = document.querySelectorAll(".change-bill");
const changeModal = document.getElementById("change-bill-modal");
const closeChangeButton = document.getElementById("close-change-modal");
const saveChangesButton = document.getElementById("save-changes");

if (changeModal && closeChangeButton && saveChangesButton) {

    changeButtons.forEach(button => {
        button.addEventListener("click", function(){
            document.getElementById("edit-item").value = this.dataset.item;
            document.getElementById("edit-total").value = this.dataset.total;
            document.getElementById("edit-people").value = this.dataset.people;
            document.getElementById("edit-budget").value = this.dataset.budget;
            document.getElementById("edit-id").value = this.dataset.id;
            document.getElementById("edit-date").value = button.dataset.date;

            changeModal.style.display = "block";
        });
    });

    closeChangeButton.addEventListener("click", function(){
        changeModal.style.display = "none";
    });

    saveChangesButton.addEventListener("click", function(){
        fetch('/update-bill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: document.getElementById("edit-id").value,
                item: document.getElementById("edit-item").value,
                total_amount: document.getElementById("edit-total").value,
                number_people: document.getElementById("edit-people").value,
                budget: document.getElementById("edit-budget").value,
                due_date: document.getElementById('edit-date').value
            })
        }).then(response => {
            if (response.ok) {
                window.location.href = "/split_items";
            } else {
                alert("Couldnt save changes");
            }
        });
    });
}
    document.querySelectorAll(".bill").forEach(function(bill){
        const container = bill.parentElement;
        dragElement(container);
    });
    document.querySelectorAll(".note-card").forEach(function(note){
        const container = note.parentElement;
        dragElement(container);
    })

    function dragElement(elmnt){
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = elmnt.querySelector(".drag-header");

        if (header){
            header.onmousedown = dragMouseDown;
        }else{
            elmnt.onmousedown = dragMouseDown;
        }
        function dragMouseDown(e){
            e=e|| window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        }
    }

    const cards = document.querySelectorAll('.draggable-card');

    const cardWidth = 330;
    const startX = 30;
    const startY = 100;

    const columns = Math.max(1, Math.floor((window.innerWidth - startX) / cardWidth));

    cards.forEach((card,index)=>{
        const column = index%columns;
        const row = Math.floor(index / columns);

        card.style.left = `${startX + column * cardWidth}px`;
        card.style.top = `${startY + row * 460}px`;
    });

    const searchInput = document.getElementById("search-bills");
    const filterSelect = document.getElementById("filter-bills");

    function filterBills(){
        const searchValue = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

         document.querySelectorAll(".bill-card").forEach(bill=>{
                const billName = bill.querySelector("textarea").value.toLowerCase();
                const status = bill.dataset.status;

                const matchesSearch = billName.includes(searchValue);
                const matchesFilter = filterValue === "all"|| status === filterValue;

                bill.style.display=matchesSearch && matchesFilter ? "flex":"none";
            });
    }
    if (searchInput && filterSelect){
        searchInput.addEventListener("input", filterBills);
        filterSelect.addEventListener("change",filterBills);
    }


});








