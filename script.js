// Arabic alphabet comparison function
function compareArabic(a, b) {
    // Using Intl.Collator for accurate Arabic alphabet sorting
    return new Intl.Collator('ar').compare(a, b);
}

// Initialize variables
let names = [];
let sortedNames = [];
let isSorted = false;

// DOM elements
const nameInput = document.getElementById('nameInput');
const addButton = document.getElementById('addButton');
const sortAscButton = document.getElementById('sortAscButton');
const sortDescButton = document.getElementById('sortDescButton');
const resetButton = document.getElementById('resetButton');
const originalList = document.getElementById('originalList');
const sortedList = document.getElementById('sortedList');
const errorMessage = document.getElementById('errorMessage');

// Add name function
function addName() {
    const name = nameInput.value.trim();
    
    // Validate input
    if (name === '') {
        errorMessage.textContent = 'الرجاء إدخال اسم';
        return;
    }
    
    // Check if the name contains only Arabic characters
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    if (!arabicRegex.test(name)) {
        errorMessage.textContent = 'الرجاء إدخال أسماء باللغة العربية فقط';
        return;
    }
    
    // Clear error message if validation passes
    errorMessage.textContent = '';
    
    // Add name to array
    names.push(name);
    
    // Update display
    updateLists();
    
    // Clear input
    nameInput.value = '';
}

// Sort names in ascending order
function sortNamesAscending() {
    // Create a copy of the original array to keep the original unsorted
    sortedNames = [...names];
    
    // Sort the copy using Arabic collation (ascending)
    sortedNames.sort(compareArabic);
    
    // Update flag and active button styling
    isSorted = true;
    sortAscButton.classList.add('active');
    sortDescButton.classList.remove('active');
    
    // Update display
    updateLists();
}

// Sort names in descending order
function sortNamesDescending() {
    // Create a copy of the original array to keep the original unsorted
    sortedNames = [...names];
    
    // Sort the copy using Arabic collation (descending)
    sortedNames.sort((a, b) => compareArabic(b, a));
    
    // Update flag and active button styling
    isSorted = true;
    sortDescButton.classList.add('active');
    sortAscButton.classList.remove('active');
    
    // Update display
    updateLists();
}

// Reset function
function resetAll() {
    names = [];
    sortedNames = [];
    isSorted = false;
    nameInput.value = '';
    errorMessage.textContent = '';
    updateLists();
}

// Edit name function
function editName(index, li) {
    // Get the current name element and its text
    const nameSpan = li.querySelector('.name-display');
    const currentName = nameSpan.textContent;
    
    // Hide the name display
    nameSpan.style.display = 'none';
    
    // Create an input field
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentName;
    inputField.className = 'name-edit';
    inputField.dir = 'rtl';
    
    // Change the edit button to a save button
    const editButton = li.querySelector('.edit-btn');
    editButton.textContent = 'حفظ';
    editButton.className = 'save-btn';
    
    // Remove the old event listener and add a new one for saving
    const newEditButton = editButton.cloneNode(true);
    editButton.parentNode.replaceChild(newEditButton, editButton);
    
    newEditButton.addEventListener('click', () => saveEdit(index, li, inputField));
    
    // Add event listener for Enter key
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            saveEdit(index, li, inputField);
        }
    });
    
    // Insert the input field in place of the name span
    li.insertBefore(inputField, nameSpan);
    
    // Focus the input field
    inputField.focus();
}

// Save edit function
function saveEdit(index, li, inputField) {
    const newName = inputField.value.trim();
    const nameSpan = li.querySelector('.name-display');
    
    // Validate the new name
    if (newName === '') {
        alert('الاسم لا يمكن أن يكون فارغاً');
        return;
    }
    
    // Check if the name contains only Arabic characters
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    if (!arabicRegex.test(newName)) {
        alert('الرجاء إدخال أسماء باللغة العربية فقط');
        return;
    }
    
    // Update the name in the array
    names[index] = newName;
    
    // Update the display span
    nameSpan.textContent = newName;
    nameSpan.style.display = '';
    
    // Remove the input field
    inputField.remove();
    
    // Change save button back to edit button
    const saveButton = li.querySelector('.save-btn');
    saveButton.textContent = 'تعديل';
    saveButton.className = 'edit-btn';
    
    // Remove the old event listener and add a new one for editing
    const newButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newButton, saveButton);
    newButton.addEventListener('click', () => editName(index, li));
    
    // Re-sort if sorted view is active
    if (isSorted) {
        sortedNames = [...names];
        if (document.getElementById('sortDescButton').classList.contains('active')) {
            sortedNames.sort((a, b) => compareArabic(b, a)); // Descending
        } else {
            sortedNames.sort(compareArabic); // Ascending
        }
        updateSortedList();
    }
}

// Update only sorted list
function updateSortedList() {
    // Clear sorted list
    sortedList.innerHTML = '';
    
    // Update sorted list if sorting has been performed
    if (isSorted) {
        sortedNames.forEach((name, index) => {
            const li = document.createElement('li');
            
            // Create name span
            const nameSpan = document.createElement('span');
            nameSpan.className = 'name-display';
            nameSpan.textContent = name;
            
            // Create rank span
            const rankSpan = document.createElement('span');
            rankSpan.className = 'rank';
            rankSpan.textContent = index + 1;
            
            // Append elements to the list item
            li.appendChild(nameSpan);
            li.appendChild(rankSpan);
            
            sortedList.appendChild(li);
        });
    }
}

// Update lists display
function updateLists() {
    // Clear current lists
    originalList.innerHTML = '';
    sortedList.innerHTML = '';
    
    // Update original list
    names.forEach((name, index) => {
        const li = document.createElement('li');
        
        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'تعديل';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', () => editName(index, li));
        
        // Create name span
        const nameSpan = document.createElement('span');
        nameSpan.className = 'name-display';
        nameSpan.textContent = name;
        
        // Create rank span
        const rankSpan = document.createElement('span');
        rankSpan.className = 'rank';
        rankSpan.textContent = index + 1;
        
        // Append all elements to the list item
        li.appendChild(editButton);
        li.appendChild(nameSpan);
        li.appendChild(rankSpan);
        
        originalList.appendChild(li);
    });
    
    // Update sorted list
    updateSortedList();
}

// Event listeners
addButton.addEventListener('click', addName);

nameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addName();
    }
});

sortAscButton.addEventListener('click', sortNamesAscending);
sortDescButton.addEventListener('click', sortNamesDescending);
resetButton.addEventListener('click', resetAll);
