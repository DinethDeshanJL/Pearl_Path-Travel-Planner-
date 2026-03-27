// Add interactivity here for later functionality

document.addEventListener('DOMContentLoaded', () => {
    // --- Global User Profile Logic ---
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || 'Traveler';

    if (isLoggedIn) {
        // Update dedicated user profile avatars (Dashboard, Explore, Budget)
        const userProfiles = document.querySelectorAll('.user-profile');
        userProfiles.forEach(profile => {
            if (!profile.querySelector('.user-name-label')) {
                profile.style.display = 'flex';
                profile.style.alignItems = 'center';
                profile.style.gap = '0.75rem';
                profile.style.cursor = 'pointer';

                const nameLabel = document.createElement('span');
                nameLabel.className = 'user-name-label';
                nameLabel.style.fontWeight = '600';
                nameLabel.style.color = 'var(--text-dark)';
                nameLabel.innerText = `Hi, ${userName}`;

                profile.insertBefore(nameLabel, profile.firstChild);
                
                const avatar = profile.querySelector('.avatar');
                if (avatar) {
                    avatar.innerHTML = `<span style="color: white; font-weight: 600; font-size: 1rem;">${userName.charAt(0)}</span>`;
                    avatar.style.display = 'flex';
                    avatar.style.alignItems = 'center';
                    avatar.style.justifyContent = 'center';
                    avatar.style.backgroundColor = 'var(--brand-blue)';
                }
            }
        });
    }

    // Hero Background Slideshow
    const heroBg = document.getElementById('hero-bg');
    const heroIndicators = document.getElementById('hero-indicators');
    
    if (heroBg && heroIndicators) {
        const indicators = heroIndicators.querySelectorAll('.indicator');
        const images = [
            "url('hero-bg.jpg')", // The port image
            "url('bg2.jpg')", // Another beautiful Sri Lankan image (Dambulla)
            "url('bg3.jpg')", // Sri Lanka 1
            "url('bg4.jpg')", // Sri Lanka 2
            "url('bg5.jpg')"  // Sri Lanka 3
        ];
        
        let currentIndex = 0;
        
        function updateBackground(index) {
            heroBg.style.backgroundImage = images[index];
            indicators.forEach(ind => ind.classList.remove('active'));
            indicators[index].classList.add('active');
            currentIndex = index;
        }
        
        // Add click events to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                updateBackground(index);
                resetTimer(); // Reset auto-slide timer if user clicks
            });
        });
        
        // Auto slide
        let slideTimer = setInterval(() => {
            let nextIndex = (currentIndex + 1) % images.length;
            updateBackground(nextIndex);
        }, 5000); // Change image every 5 seconds
        
        function resetTimer() {
            clearInterval(slideTimer);
            slideTimer = setInterval(() => {
                let nextIndex = (currentIndex + 1) % images.length;
                updateBackground(nextIndex);
            }, 5000);
        }
    }

    // Start Plan Button access control
    const startPlanBtn = document.getElementById('start-plan-btn');
    if (startPlanBtn) {
        startPlanBtn.addEventListener('click', (e) => {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault();
                alert('Please sign in first to start planning your trip.');
                window.location.href = 'login.html';
            }
        });
    }

    // --- Budget Planner Logic ---
    const expenseTableBody = document.getElementById('expense-table-body');
    if (expenseTableBody) {
        let expenses = [
            { id: 1, date: '2024-07-18', name: 'Galle Fort Dinner', category: 'FOOD', amount: 0.00 },
            { id: 2, date: '2024-07-17', name: 'Ella Homestay (3 Nights)', category: 'STAY', amount: 0.00 },
            { id: 3, date: '2024-07-16', name: 'Kandy Train Tickets', category: 'TRANSPORT', amount: 0.00 },
            { id: 4, date: '2024-07-15', name: 'Colombo Return Flight', category: 'FLIGHTS', amount: 0.00 },
            { id: 5, date: '2024-07-15', name: 'Airport Tuk-Tuk Transfer', category: 'TRANSPORT', amount: 0.00 }
        ];

        const totalBudgetEl = document.getElementById('budget-total');
        let totalBudget = 50000;
        let currentEditingId = null;
        let tripStartDate = new Date('2024-07-15');
        let tripEndDate = new Date('2024-07-28');

        const formatRs = (num) => 'Rs.' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const updateStats = () => {
            const spent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
            const remaining = totalBudget - spent;
            const percent = totalBudget > 0 ? ((spent / totalBudget) * 100).toFixed(0) : 0;
            
            // Calculate remaining days based on tripEndDate and today
            const today = new Date('2024-07-20'); // Hardcoding today to fit dummy data context
            let remainingDays = Math.ceil((tripEndDate - today) / (1000 * 60 * 60 * 24));
            if (remainingDays < 1) remainingDays = 1; 
            const dailyAvg = remaining / remainingDays;

            document.getElementById('budget-spent').innerText = formatRs(spent);
            document.getElementById('budget-remaining').innerText = formatRs(remaining);
            document.getElementById('budget-percent').innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> ${percent}% of budget`;
            document.getElementById('budget-daily').innerText = formatRs(dailyAvg);
            
            const runningTotalEl = document.getElementById('running-total');
            if (runningTotalEl) runningTotalEl.innerText = formatRs(spent);
        };

        const getCategoryBadgeClass = (cat) => {
            const map = {
                'FOOD': 'cat-food',
                'STAY': 'cat-stay',
                'TRANSPORT': 'cat-transport',
                'FLIGHTS': 'cat-flights',
                'ACTIVITIES': 'cat-activities',
                'OTHER': 'cat-activities'
            };
            return map[cat.toUpperCase()] || 'cat-activities';
        };

        const renderExpenses = () => {
            expenseTableBody.innerHTML = '';
            expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(exp => {
                const dateObj = new Date(exp.date);
                const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${dateStr}</td>
                    <td class="item-name">${exp.name}</td>
                    <td><span class="cat-badge ${getCategoryBadgeClass(exp.category)}">${exp.category.toUpperCase()}</span></td>
                    <td class="item-amount">${formatRs(exp.amount)}</td>
                    <td class="item-action">
                        <button onclick="editExpense(${exp.id})"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="deleteExpense(${exp.id})" style="color: #ef4444; margin-left: 0.5rem;"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                expenseTableBody.appendChild(tr);
            });
            updateStats();
        };

        // Modal Logic
        const modal = document.getElementById('expense-modal');
        const addBtn = document.getElementById('add-expense-btn');
        const form = document.getElementById('expense-form');
        const modalTitle = document.getElementById('modal-title');

        window.closeExpenseModal = () => {
            modal.classList.remove('show');
            form.reset();
            currentEditingId = null;
        };

        addBtn.addEventListener('click', () => {
            modalTitle.innerText = 'Add Expense';
            currentEditingId = null;
            form.reset();
            document.getElementById('expense-date').valueAsDate = new Date(); // default to today
            modal.classList.add('show');
        });

        window.editExpense = (id) => {
            const exp = expenses.find(e => e.id === id);
            if (!exp) return;
            
            currentEditingId = id;
            modalTitle.innerText = 'Edit Expense';
            document.getElementById('expense-date').value = exp.date;
            document.getElementById('expense-name').value = exp.name;
            document.getElementById('expense-category').value = exp.category;
            document.getElementById('expense-amount').value = exp.amount;
            
            modal.classList.add('show');
        };

        window.deleteExpense = (id) => {
            if (confirm('Are you sure you want to delete this expense?')) {
                expenses = expenses.filter(e => e.id !== id);
                renderExpenses();
            }
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const expData = {
                date: document.getElementById('expense-date').value,
                name: document.getElementById('expense-name').value,
                category: document.getElementById('expense-category').value,
                amount: parseFloat(document.getElementById('expense-amount').value)
            };

            if (currentEditingId !== null) {
                expenses = expenses.map(exp => exp.id === currentEditingId ? { ...exp, ...expData } : exp);
            } else {
                const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
                expenses.push({ id: newId, ...expData });
            }

            closeExpenseModal();
            renderExpenses();
        });

        // Trip Modal Logic
        const tripModal = document.getElementById('trip-modal');
        const editTripBtn = document.getElementById('edit-trip-btn');
        const tripForm = document.getElementById('trip-form');

        window.closeTripModal = () => {
            tripModal.classList.remove('show');
        };

        if (editTripBtn) {
            editTripBtn.addEventListener('click', () => {
                document.getElementById('trip-title-input').value = document.getElementById('trip-title').innerText;
                document.getElementById('trip-budget-input').value = totalBudget;
                
                // Set dates
                document.getElementById('trip-start-date').valueAsDate = tripStartDate;
                document.getElementById('trip-end-date').valueAsDate = tripEndDate;
                
                tripModal.classList.add('show');
            });
        }

        if (tripForm) {
            tripForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const newTitle = document.getElementById('trip-title-input').value;
                totalBudget = parseFloat(document.getElementById('trip-budget-input').value);
                tripStartDate = document.getElementById('trip-start-date').valueAsDate;
                tripEndDate = document.getElementById('trip-end-date').valueAsDate;
                
                // Update UI
                document.getElementById('trip-title').innerText = newTitle;
                document.getElementById('budget-total').innerText = formatRs(totalBudget);
                
                // Keep the exact subtitle structure
                document.getElementById('trip-subtitle').innerText = `Manage your spending and stay within your ${formatRs(totalBudget)} budget.`;
                
                const formatShortDate = (date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
                document.getElementById('trip-dates').innerHTML = `<i class="fa-regular fa-calendar text-blue"></i> ${formatShortDate(tripStartDate)} - ${formatShortDate(tripEndDate)}, ${tripEndDate.getFullYear()}`;
                
                closeTripModal();
                updateStats();
            });
        }

        // Initialize table mapping
        renderExpenses();

        // ---------------------------
        // Bonus Interactions Logic
        // ---------------------------

        // Feedback Stars Logic
        const starsContainer = document.getElementById('feedback-stars');
        if (starsContainer) {
            const stars = starsContainer.querySelectorAll('.fa-star');
            stars.forEach(star => {
                star.addEventListener('click', (e) => {
                    const rating = parseInt(e.target.getAttribute('data-val'));
                    stars.forEach(s => {
                        if (parseInt(s.getAttribute('data-val')) <= rating) {
                            s.style.color = '#F59E0B'; // Highlight orange
                        } else {
                            s.style.color = '#E2E8F0'; // Gray
                        }
                    });
                });
            });
        }

        // View Details Modal Logic
        const viewDetailsModal = document.getElementById('view-details-modal');
        window.openViewDetails = (title, content) => {
            if (viewDetailsModal) {
                document.getElementById('view-details-title').innerText = title;
                document.getElementById('view-details-content').innerText = content;
                viewDetailsModal.classList.add('show');
            }
        };
        window.closeViewDetailsModal = () => {
            if (viewDetailsModal) viewDetailsModal.classList.remove('show');
        };

        // Finish Trip Logic (Save to History)
        const finishTripBtn = document.getElementById('finish-trip-btn');
        const historyGrid = document.getElementById('trip-history-grid');
        if (finishTripBtn && historyGrid) {
            finishTripBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to finish this trip and save it to history?')) {
                    const title = document.getElementById('trip-title').innerText;
                    const dates = document.getElementById('trip-dates').innerText.replace('...', ''); // cleanup icon text if needed
                    const spent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
                    
                    const isOverBudget = spent > totalBudget;
                    const spentColor = isOverBudget ? 'color: var(--app-orange);' : 'class="text-green"';
                    const diffText = isOverBudget ? `<span style="font-size: 0.75rem;">(+${formatRs(spent - totalBudget)})</span>` : '';
                    
                    const newCard = document.createElement('div');
                    newCard.className = 'journey-card';
                    newCard.style.cssText = 'box-shadow: none; border: 1px solid var(--border-color);';
                    newCard.innerHTML = `
                        <div class="journey-img" style="background-color: #E0F2FE; height: 120px; display: flex; align-items: center; justify-content: center;">
                            <i class="fa-solid fa-map-location-dot" style="font-size: 2.5rem; color: var(--brand-blue);"></i>
                            <span class="journey-badge" style="background: rgba(255,255,255,0.9); color: var(--text-dark);">NEW COMPLETED</span>
                        </div>
                        <div class="journey-content" style="padding: 1rem;">
                            <h3 class="journey-title" style="font-size: 1.1rem; margin-bottom: 0.25rem;">${title}</h3>
                            <p class="journey-dates" style="font-size: 0.8rem; margin-bottom: 0.5rem;">${dates}</p>
                            <div style="background: var(--bg-light); padding: 0.75rem; border-radius: var(--radius-md); margin-top: 0.75rem;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                                    <span style="color: var(--text-gray);">Budget:</span>
                                    <strong>${formatRs(totalBudget)}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                                    <span style="color: var(--text-gray);">Spent:</span>
                                    <strong ${spentColor}>${formatRs(spent)} ${diffText}</strong>
                                </div>
                            </div>
                            <button class="btn btn-outline w-100" style="margin-top: 1rem; color: var(--text-dark); border-color: var(--border-color);" onclick="openViewDetails('${title}', 'Recently completed trip. Final total spent was ${formatRs(spent)}.')">View Details</button>
                        </div>
                    `;
                    // Insert at beginning of grid
                    historyGrid.insertBefore(newCard, historyGrid.firstChild);
                    
                    // Reset current trip to empty state
                    expenses = [];
                    renderExpenses();
                    alert('Trip successfully saved to history!');
                }
            });
        }
    }

    // --- Explore Page Logic ---
    const searchInput = document.getElementById('explore-search-input');
    const mainExploreGrid = document.getElementById('main-explore-grid');
    const destCards = mainExploreGrid ? mainExploreGrid.querySelectorAll('.dest-card') : [];
    
    // Search Functionality
    if (searchInput && destCards.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            destCards.forEach(card => {
                const title = card.querySelector('.dest-title').innerText.toLowerCase();
                const desc = card.querySelector('.dest-desc').innerText.toLowerCase();
                // Check if match
                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // My Plan Functionality
    const myPlanSection = document.getElementById('my-plan-section');
    const myPlanGrid = document.getElementById('my-plan-grid');
    const navMyPlanBtn = document.getElementById('nav-my-plan-btn');

    if (mainExploreGrid && myPlanSection) {
        const addBtns = mainExploreGrid.querySelectorAll('.btn-light-blue');
        addBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.dest-card');
                
                // Change original button state visually
                const originalBtnText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Added to Plan';
                btn.classList.replace('btn-light-blue', 'btn-primary');
                btn.disabled = true;
                
                // Show My Plan Section
                myPlanSection.style.display = 'block';
                
                // Clone card to My Plan
                const clonedCard = card.cloneNode(true);
                // Change button on cloned card to "Remove"
                const clonedBtn = clonedCard.querySelector('.btn');
                clonedBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Remove';
                if (clonedBtn.classList.contains('btn-primary')) clonedBtn.classList.replace('btn-primary', 'btn-outline');
                if (clonedBtn.classList.contains('btn-light-blue')) clonedBtn.classList.replace('btn-light-blue', 'btn-outline');
                clonedBtn.style.color = 'var(--app-orange)';
                clonedBtn.style.borderColor = 'var(--app-orange)';
                clonedBtn.disabled = false;
                
                clonedBtn.addEventListener('click', () => {
                    clonedCard.remove();
                    // Re-enable original button
                    btn.innerHTML = originalBtnText;
                    btn.classList.replace('btn-primary', 'btn-light-blue');
                    btn.disabled = false;
                    
                    // Hide section if empty
                    if (myPlanGrid.children.length === 0) {
                        myPlanSection.style.display = 'none';
                    }
                });
                
                myPlanGrid.appendChild(clonedCard);
            });
        });

        // Nav click to scroll to My Plan
        if (navMyPlanBtn) {
            navMyPlanBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (myPlanGrid.children.length > 0) {
                    myPlanSection.style.display = 'block';
                    myPlanSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    alert('Your plan is currently empty! Click "Add to Plan" on a destination first.');
                }
            });
        }
    }

    // --- Dashboard Specific Logic ---
    const dashAddBtn = document.getElementById('dash-add-btn');
    const dashDestInput = document.getElementById('dash-dest-input');
    const dashStartDate = document.getElementById('dash-start-date');
    const dashEndDate = document.getElementById('dash-end-date');
    const dashActivitiesInput = document.getElementById('dash-activities-input');
    const dashJourneyGrid = document.getElementById('dash-journey-grid');

    if (dashAddBtn && dashJourneyGrid) {
        dashAddBtn.addEventListener('click', () => {
            const dest = dashDestInput.value;
            const start = dashStartDate.valueAsDate;
            const end = dashEndDate.valueAsDate;
            const activities = dashActivitiesInput.value;

            if (!dest || !start || !end) {
                alert('Please fill out the destination and dates.');
                return;
            }

            const formatShortDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const dateStr = `${formatShortDate(start)} - ${formatShortDate(end)}, ${end.getFullYear()}`;
            
            const activityItems = activities.split(',').map(act => act.trim()).filter(act => act.length > 0);
            const lis = activityItems.map(act => `<li><i class="fa-solid fa-circle-check text-blue"></i> ${act}</li>`).join('');

            const newCard = document.createElement('div');
            newCard.className = 'journey-card';
            newCard.innerHTML = `
                <div class="journey-img" style="background-color: #E0F2FE; display: flex; align-items: center; justify-content: center; height: 120px;">
                    <i class="fa-solid fa-plane-departure" style="font-size: 2.5rem; color: var(--brand-blue);"></i>
                    <span class="journey-badge" style="background: rgba(255,255,255,0.9); color: var(--text-dark);">NEW PLAN</span>
                </div>
                <div class="journey-content">
                    <h3 class="journey-title">${dest}</h3>
                    <p class="journey-dates"><i class="fa-regular fa-calendar"></i> ${dateStr}</p>
                    <ul class="journey-activities">${lis}</ul>
                </div>
            `;
            
            dashJourneyGrid.insertBefore(newCard, dashJourneyGrid.firstChild);

            // Reset form
            dashDestInput.value = '';
            dashStartDate.value = '';
            dashEndDate.value = '';
            dashActivitiesInput.value = '';
            
            alert('Adventure planned! Added to your Upcoming Journeys.');
        });
    }

    // Dashboard Live Map Modal
    const viewMapLink = document.getElementById('view-map-link');
    const mapModal = document.getElementById('map-modal');
    
    window.closeMapModal = () => {
        if (mapModal) mapModal.classList.remove('show');
    };

    if (viewMapLink && mapModal) {
        viewMapLink.addEventListener('click', (e) => {
            e.preventDefault();
            mapModal.classList.add('show');
        });
    }
});
