document.addEventListener('DOMContentLoaded', () => {
    fetch('/registrants') // Fetch data for the logged-in user from /registrants endpoint
        .then(response => response.json())
        .then(data => {
            const registrantsTableBody = document.getElementById('registrantsTableBody');
            registrantsTableBody.innerHTML = ''; // Clear table body before appending new data

            data.forEach(registrant => {
                registrantsTableBody.innerHTML += `
                    <tr>
                        <td>${registrant.id}</td>
                        <td>${registrant.fullName}</td>
                        <td>${registrant.birthDate}</td>
                        <td>${registrant.nik}</td>
                        <td>${registrant.parentName}</td>
                        <td>${registrant.schoolOrigin}</td>
                        <td>${registrant.schoolTarget}</td>
                        <td>${registrant.majorChoice}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error fetching registrants:', error));
});
