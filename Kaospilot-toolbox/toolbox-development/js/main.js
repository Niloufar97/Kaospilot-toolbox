"use strict";
window.addEventListener('DOMContentLoaded', () => {

    /*---------- Cards ---------*/
    const gallery = document.querySelector(".gallery");
    const swiperWrapper = document.querySelector(".swiper-wrapper");

    /* ---------- Sort ---------- */
    // Mobile version - detect click event on filters tab
    const filterTab = document.querySelector('.tab-filter'),
        filterTabPlaceholder = filterTab.querySelector('.placeholder a'),
        filterTabSortOption = filterTab.querySelectorAll('li');
    const filterTabPlaceholderDefaultValue = 'Select';
    let filterTabPlaceholderText = filterTabPlaceholder.textContent;

    /*---------- Filter ---------*/
    //Filter Trigger
    const filterTrigger = document.querySelector('.filter-trigger'),
        filterClose = document.querySelector('.close');

    //Filter Title
    const filterBlockTitle = document.querySelectorAll('.filter-block h4');

    //Checkboxes
    const filterForm = document.querySelector('.filter-form'),
        difficultyCheckboxes = filterForm.querySelectorAll('.filter_difficulty'),
        categoryCheckboxes = document.querySelectorAll('.filter_category');

    //Slider
    const fromSlider = document.querySelector('#fromSlider'),
        toSlider = document.querySelector('#toSlider'),
        fromInput = document.querySelector('#fromInput'),
        toInput = document.querySelector('#toInput'),
        fromSliderTime = document.querySelector('#fromSliderTime'),
        toSliderTime = document.querySelector('#toSliderTime'),
        fromInputTime = document.querySelector('#fromInputTime'),
        toInputTime = document.querySelector('#toInputTime');

    /*---------- PopUp ---------*/
    const popup = document.querySelector(".popup"),
        popupWrapper = popup.querySelector(".popup-wrapper"),
        popupClose = popup.querySelector(".popup-close-btn"),
        popupHeader = popup.querySelector(".popup-header-title"),
        popupDifficulty = popup.querySelector(".info-item-title__difficulty"),
        popupParticipants = popup.querySelector(".info-item-title__participants"),
        popupDuration = popup.querySelector(".info-item-title__duration"),
        popupMainImage = popup.querySelector(".popup-main-image"),
        popupPitch = popup.querySelector(".main-paragraph-pitch"),
        popupDescription = popup.querySelector(".main-paragraph-description"),
        popupMatirials = popup.querySelector(".main-paragraph-materials"),
        popupSource = popup.querySelector(".main-paragraph-source"),
        fullStepContainer = document.getElementById("main-steps-container"),
        popupPrintBtn = popup.querySelector(".popup-print-btn");


    // Fetch JSON data and render initial cards
    fetch('workshops1.json').then(response => response.json()).then(items => {
        // Add the `id` property to each object using the index as the value
        items = items.map((item, index) => {
            return {...item, id: index + 1};
        });

        let currentCardsToShowAmount = 6;
        let latestFilteredCardsFull;
        renderSwiper(items);
        renderCardsRow(items);

        //render new workshops from json file dinamically
        function renderCardsRow(cardsArray) {
            latestFilteredCardsFull = cardsArray;
            if (cardsArray.length > currentCardsToShowAmount) {
                const reducedCardsArray = cardsArray.slice(0, currentCardsToShowAmount);
                renderCards(reducedCardsArray);

                // Load more button
                const loadMoreButton = document.createElement("button");
                loadMoreButton.classList.add('load-more', 'btn');
                loadMoreButton.textContent = 'Load more';
                gallery.appendChild(loadMoreButton);

                loadMoreButton.addEventListener('click', () => {
                    currentCardsToShowAmount = currentCardsToShowAmount + 6;
                    checkAndRender(latestFilteredCardsFull);
                });
            } else {
                renderCards(cardsArray);
            }
        }

        function renderCards(cardsArray, parentElement = gallery) {
            for (const cardData of cardsArray) {
                const card = createCardElement(cardData);

                // Add 'swiper-slide' class to the card when rendering in the swiper
                if (parentElement.classList.contains('swiper-wrapper')) {
                    card.classList.add('swiper-slide');
                }
                parentElement.appendChild(card);
            }
        }

        function createCardElement(cardData) {
            const card = document.createElement("div");
            card.classList.add('card');
            // Assign the object's ID as a custom attribute
            card.setAttribute('data-id', cardData.id);

            const cardImg = document.createElement("div");
            cardImg.classList.add("card-img");
            cardImg.style.backgroundImage = `url(${cardData.backgroungImage})`;

            for (const imageSrc of cardData.typeImage) {
                const img = document.createElement("img");
                img.classList.add("card-img-icon");
                img.src = imageSrc;
                cardImg.appendChild(img);
            }

            const cardInfo = document.createElement("div");
            cardInfo.classList.add("card-info");

            const cardInfoTitle = document.createElement("p");
            cardInfoTitle.classList.add("card-info-title");
            cardInfoTitle.textContent = cardData.title;
            cardInfo.appendChild(cardInfoTitle);

            const cardInfoDetails = document.createElement("div");
            cardInfoDetails.classList.add("card-info-details");

            const difficultyItem = createDetailsItem(
                "signal_cellular_alt_2_bar",
                cardData.difficulty
            );
            cardInfoDetails.appendChild(difficultyItem);

            const participantsItem = createDetailsItem(
                "group",
                `${cardData.minNumberOfParticipants} - ${cardData.maxNumberOfParticipants}`
            );
            cardInfoDetails.appendChild(participantsItem);

            const durationItem = createDetailsItem(
                "schedule",
                `${cardData.minDuration} - ${cardData.maxDuration}`
            );
            cardInfoDetails.appendChild(durationItem);

            cardInfo.appendChild(cardInfoDetails);

            card.appendChild(cardImg);
            card.appendChild(cardInfo);

            return card;
        }

        function createDetailsItem(icon, title) {
            const item = document.createElement("div");
            item.classList.add("card-info-details-item");

            const itemIcon = document.createElement("i");
            itemIcon.classList.add("details-item-icon", "material-icons");

            itemIcon.textContent = icon;
            item.appendChild(itemIcon);

            const itemTitle = document.createElement("span");
            itemTitle.classList.add("details-item-title");
            itemTitle.textContent = title;
            item.appendChild(itemTitle);

            return item;
        }

        function checkAndRender(filteredItems) {
            // Clear previous results
            gallery.innerHTML = '';

            // Check if there are any filtered items
            if (filteredItems.length === 0) {
                const failMessage = document.createElement('div');
                failMessage.classList.add('fail-message');
                failMessage.textContent = 'No results found';
                gallery.appendChild(failMessage);
            } else {
                // Render filtered items
                renderCardsRow(filteredItems);
            }
        }


        /*---------- PopUp ---------*/
        const body = document.querySelector("body");

        function popupOpen(cardData) {
            popupHeader.innerText = cardData.title;
            popupDifficulty.innerText = cardData.difficulty;
            popupParticipants.innerText = `${cardData.minNumberOfParticipants} - ${cardData.maxNumberOfParticipants}`;
            popupDuration.innerText = `${cardData.minDuration} - ${cardData.maxDuration}`;
            popupMainImage.setAttribute("src", cardData.popupImage);
            popupPitch.innerText = cardData.pitch;
            popupDescription.innerText = cardData.description;
            popupMatirials.innerText = cardData.materials;
            popupSource.innerText = cardData.source;

            //workshop steps
            fullStepContainer.innerHTML = "";
            const steps = cardData.instructions;
            const stepContainer = document.createElement("div");
            fullStepContainer.appendChild(stepContainer);
            for (let i = 0; i < steps.length; i++) {
                let stepHeader = document.createElement("h3");
                stepHeader.classList.add('main-h3');
                let stepHeaderText = document.createTextNode(`Step ${i + 1}`);
                stepHeader.appendChild(stepHeaderText);
                stepContainer.appendChild(stepHeader);
                let stepPara = document.createElement("div");
                stepPara.classList.add("main-paragraph");
                stepPara.innerText = steps[i];
                stepContainer.appendChild(stepPara);
            }

            popup.classList.add("show");
            body.classList.add("no-scroll");
            popupWrapper.scrollTo(0, 0);
        }

        //close popup when user clicks at Close button
        popupClose.addEventListener("click", () => {
            popup.classList.remove("show");
            body.classList.remove("no-scroll");
        });

        swiperWrapper.addEventListener("click", (event) => {
            const clickedCard = event.target.closest(".card");
            if (clickedCard) {
                // Retrieve the object's ID
                const cardId = clickedCard.getAttribute('data-id');
                // Find the corresponding object data
                const cardData = items.find(item => item.id === parseInt(cardId));
                if (cardData) {
                    popupOpen(cardData);
                }
            }
        });

        gallery.addEventListener("click", (event) => {
            const clickedCard = event.target.closest(".card");
            if (clickedCard) {
                const cardId = clickedCard.getAttribute('data-id'); // Retrieve the object's ID
                const cardData = items.find(item => item.id === parseInt(cardId)); // Find the corresponding object data
                if (cardData) {
                    popupOpen(cardData);
                }
            }
        });

        //print the popup content when user clicks "Print" button
        function popupPrint() {
            let printOne = popupWrapper.innerHTML;
            let w = window.open();
            w.document.write('<html><head><title>Copy Printed</title><link rel="stylesheet" href="css/reset.css"><link rel="stylesheet" href="css/style.css"></head><body>' + printOne + '</body></html>');
            setTimeout(function () {
                w.window.print()
            }, 100);
            setTimeout(function () {
                w.close()
            }, 100);
            popupWrapper.scrollTo(0, 0);
            return false;
        }

        popupPrintBtn.addEventListener("click", popupPrint);

        /* ---------- Swiper ---------- */

        function renderSwiper(items) {
            const popularItems = items.filter(item => item.isPopular === true);
            renderCards(popularItems, swiperWrapper);

            const swiper = new Swiper("#swiper-container", {
                // Optional parameters
                loop: true,
                slidesPerView: 1,
                a11y: true,
                keyboard: {
                    enabled: true,
                },

                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1170: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                },


                // If we need pagination
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },

                // Navigation arrows
                navigation: {
                    nextEl: "#js-next",
                    prevEl: "#js-prev",
                },
            });
        }


        /* ---------- Filter ---------- */


        //Filter Trigger
        const triggerFilter = (bool) => event => {
            const elementsToTrigger = document.querySelectorAll('.filter-trigger, .filter, .tab-filter, .gallery')
            elementsToTrigger.forEach((element) => {
                element.classList.toggle('filter-is-visible', bool);
            });
        }

        filterTrigger.addEventListener('click', triggerFilter(true));
        filterClose.addEventListener('click', triggerFilter(false));

        // Close filter dropdown inside lateral .filter
        filterBlockTitle.forEach(title => {
            title.addEventListener('click', () => {
                // Toggle the 'closed' class on the filter block heading
                console.log(title);
                console.log(title.nextElementSibling);
                title.classList.toggle('closed');
                title.nextElementSibling.classList.toggle('hide');
            });
        });


        // Fix lateral filter and gallery on scrolling
        window.addEventListener('scroll', function () {
            // Check if the browser supports requestAnimationFrame
            (!window.requestAnimationFrame) ? fixGallery() : window.requestAnimationFrame(fixGallery);
        });

        function fixGallery() {
            // Get the offset top of the main content
            const offsetTop = document.querySelector('.main').offsetTop;
            // Get the current scroll position
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            // Add or remove the 'is-fixed' class based on scroll position
            (scrollTop >= offsetTop) ? document.querySelector('.main').classList.add('is-fixed') : document.querySelector('.main').classList.remove('is-fixed');
        }


        /* ---------- Sort ---------- */

        function sort(selectedFilter) {
            if (selectedFilter === 'all') {
                // Sort items by id
                items.sort((a, b) => a.id - b.id);
            }
            if (selectedFilter === 'sortAlf') {
                // Sort items by name in A-Z order
                items.sort((a, b) => a.title.localeCompare(b.title));
            } else if (selectedFilter === 'sortAlfReverse') {
                // Sort items by name in Z-A order
                items.sort((a, b) => b.title.localeCompare(a.title));
            }
        }

        filterTabSortOption.forEach(option => {
            option.addEventListener('click', event => {
                // Detect which tab filter item was selected
                const selectedFilter = event.target.getAttribute('data-type');

                // Check if the user has clicked the placeholder item
                if (event.target === filterTabPlaceholder) {
                    // Toggle the text between default and selected value
                    filterTabPlaceholder.textContent = filterTabPlaceholderDefaultValue === filterTabPlaceholder.textContent ? filterTabPlaceholderText : filterTabPlaceholderDefaultValue;
                    filterTab.classList.toggle('is-open');

                } else if (filterTabPlaceholder.getAttribute('data-type') === selectedFilter) {
                    // Check if the user has clicked a filter already selected
                    // Update the text content of the placeholder
                    filterTabPlaceholder.textContent = event.target.textContent;
                    filterTab.classList.remove('is-open');

                } else {
                    // Close the dropdown and change placeholder text/data-type value
                    filterTab.classList.remove('is-open');
                    // Update the text content and data-type attribute of the placeholder
                    filterTabPlaceholder.textContent = event.target.textContent;
                    filterTabPlaceholder.setAttribute('data-type', selectedFilter);
                    // Update the stored text value
                    filterTabPlaceholderText = event.target.textContent;

                    // Add class 'selected' to the selected filter item
                    filterTab.querySelectorAll('.selected').forEach(function (item) {
                        item.classList.remove('selected');
                    });
                    event.target.classList.add('selected');

                    sort(selectedFilter);
                    handleFilterChange();
                }
            });
        });

        /* ---------- Checkbox ---------- */

        const handleFilterChange = () => {
            // Get the selected difficulty values
            const selectedDifficulties = Array.from(difficultyCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.dataset.filter);

            // Get the selected category values
            const selectedCategories = Array.from(categoryCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.dataset.filter);

            // Get the selected range values
            const fromValue = parseInt(fromSlider.value);
            const toValue = parseInt(toSlider.value);
            const fromValueTime = parseInt(fromSliderTime.value);
            const toValueTime = parseInt(toSliderTime.value);

            // Filter the items
            const filteredItems = items.filter(item => {
                const itemDifficulty = item.difficulty.toLowerCase();
                //const itemCategory = item.category.toLowerCase();

                //checks if either no difficulty checkboxes are selected or if the item's difficulty is included in the values array
                const isDifficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(itemDifficulty);
                const isCategoryMatch = selectedCategories.length === 0 || item.category.some(category => selectedCategories.includes(category.toLowerCase()));


                // Check if the item matches the range filter
                const isRangeMatch = (
                    (item.minNumberOfParticipants >= fromValue && item.minNumberOfParticipants <= toValue) ||
                    (item.maxNumberOfParticipants >= fromValue && item.maxNumberOfParticipants <= toValue) ||
                    (item.minNumberOfParticipants <= fromValue && item.maxNumberOfParticipants >= toValue)
                );

                const isRangeTimeMatch = (
                    (item.minDuration >= fromValueTime && item.minDuration <= toValueTime) ||
                    (item.maxDuration >= fromValueTime && item.maxDuration <= toValueTime) ||
                    (item.minDuration <= fromValueTime && item.maxDuration >= toValueTime)
                );

                // Return true if all conditions are satisfied
                return isDifficultyMatch && isCategoryMatch && isRangeMatch && isRangeTimeMatch;
            });

            checkAndRender(filteredItems);
        }

        difficultyCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleFilterChange);
        });

        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleFilterChange);
        });


        /* ---------- Slider ---------- */

        //sets the minimum value of the range slider and its corresponding #fromInput field
        function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
            // Get parsed 'from' and 'to' values from input fields
            const [from, to] = getParsed(fromInput, toInput);
            // If 'from' value is greater than 'to' value, update 'from' slider and input to match 'to' value
            if (from > to) {
                fromSlider.value = to;
                fromInput.value = to;
            } else {
                // Otherwise, update 'from' slider to match 'from' value
                fromSlider.value = from;
            }
            // Fill the slider track with color
            fillSlider(fromInput, toInput, '#b8c1ec', '#232946', controlSlider);
        }

        //sets the maximum value of the range slider and its corresponding #toInput field
        function controlToInput(toSlider, fromInput, toInput, controlSlider) {
            // Get parsed 'from' and 'to' values from input fields
            const [from, to] = getParsed(fromInput, toInput);
            // Set accessibility of 'to' slider
            setToggleAccessible(toInput);
            if (from <= to) {
                toSlider.value = to;
                toInput.value = to;
            } else {
                toInput.value = from;
            }
            // Fill the slider track with color
            fillSlider(fromInput, toInput, '#b8c1ec', '#232946', controlSlider);
        }

        //function updates the #fromInput field when the range slider is adjusted by the user
        function controlFromSlider(fromSlider, toSlider, fromInput) {
            const [from, to] = getParsed(fromSlider, toSlider);
            fillSlider(fromSlider, toSlider, '#b8c1ec', '#232946', toSlider);
            if (from > to) {
                fromSlider.value = to;
                fromInput.value = to;
            } else {
                fromInput.value = from;
            }
        }

        //function updates the #toInput field when the range slider is adjusted by the user
        function controlToSlider(fromSlider, toSlider, toInput) {
            const [from, to] = getParsed(fromSlider, toSlider);
            fillSlider(fromSlider, toSlider, '#b8c1ec', '#232946', toSlider);
            setToggleAccessible(toSlider);
            if (from <= to) {
                toSlider.value = to;
                toInput.value = to;
            } else {
                toInput.value = from;
                toSlider.value = from;
            }
        }

        //function gets the current values of the #fromInput and #toInput fields and returns them as an array
        function getParsed(currentFrom, currentTo) {
            const from = parseInt(currentFrom.value, 10);
            const to = parseInt(currentTo.value, 10);
            return [from, to];
        }

        //function fills the range slider track with a gradient color based on the current values of the 'from' and 'to' input fields
        function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
            // Calculate range distance and positions of 'from' and 'to' values
            const rangeDistance = to.max - to.min;
            const fromPosition = from.value - to.min;
            const toPosition = to.value - to.min;
            // Apply gradient background color to slider
            controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;

            handleFilterChange();
        }

        // Adjusts the z-index of the 'to' slider based on its value to make it accessible or not
        function setToggleAccessible(currentTarget) {
            const toSlider = document.querySelector('#toSlider');
            // If 'to' value is zero or less, set 'to' slider z-index to make it accessible
            if (Number(currentTarget.value) <= 0) {
                toSlider.style.zIndex = 2;
            } else {
                // Otherwise, set 'to' slider z-index to default
                toSlider.style.zIndex = 0;
            }
        }

        fillSlider(fromSlider, toSlider, '#b8c1ec', '#232946', toSlider);
        setToggleAccessible(toSlider);

        fillSlider(fromSliderTime, toSliderTime, '#b8c1ec', '#232946', toSliderTime);
        setToggleAccessible(toSliderTime);

        fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
        toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
        fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
        toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);

        fromSliderTime.oninput = () => controlFromSlider(fromSliderTime, toSliderTime, fromInputTime);
        toSliderTime.oninput = () => controlToSlider(fromSliderTime, toSliderTime, toInputTime);
        fromInputTime.oninput = () => controlFromInput(fromSliderTime, fromInputTime, toInputTime, toSliderTime);
        toInputTime.oninput = () => controlToInput(toSliderTime, fromInputTime, toInputTime, toSliderTime);

    }).catch(error => {
        console.log('Error occurred:', error);
    });
});