/**
 * Select Custom Library.
 * WebDevSimplified Tuto
 * - https://www.youtube.com/watch?v=Fc-oyl31mRI&feature=emb_rel_end
 * 
 */
export default class Select {
    constructor(element) {
        this.element = element
        this.options = getFormattedOptions(element.querySelectorAll("option"))
        this.customElement = document.createElement("div")
        this.labelElement = document.createElement("span")
        this.optionsCustomElement = document.createElement("ul")
        setupCustomElement(this)
        element.style.display = "none"
        element.after(this.customElement)
    }

    get selectedOption() {
        return this.options.find(option => option.selected)
    }

    get selectedOptionIndex() {
        return this.options.indexOf(this.selectedOption)
    }

    selectValue(value) {
        const newSelectedOption = this.options.find(option => {
            return option.value === value
        })
        const prevSelectedOption = this.selectedOption
        prevSelectedOption.selected = false
        prevSelectedOption.element.selected = false

        newSelectedOption.selected = true
        newSelectedOption.element.selected = true

        this.labelElement.innerText = newSelectedOption.label

        this.optionsCustomElement
            .querySelector(`[data-value="${prevSelectedOption.value}"]`)
            .classList.remove("selected")
        const newCustomElement = this.optionsCustomElement
            .querySelector(`[data-value="${newSelectedOption.value}"]`)
        newCustomElement.classList.add("selected")
        // Scroll if selection is out of view
        newCustomElement.scrollIntoView({ block: 'nearest' })
    }

}


/**
 * Making the functionnality works.
 * 
 * @param {Object} select Dom HTML Select Object
 */
function setupCustomElement(select) {

    // Custom Element
    select.customElement.classList.add("custom-select-container")
    select.customElement.tabIndex = 0

    // Label
    select.labelElement.classList.add("custom-select-value")
    select.labelElement.innerText = select.selectedOption.label
    select.customElement.append(select.labelElement)

    // Options
    select.optionsCustomElement.classList.add("custom-select-options")
    select.options.forEach(option => {
        const optionElement = document.createElement("li")
        optionElement.classList.add("custom-select-option")
        optionElement.classList.toggle("selected", option.selected)
        optionElement.innerText = option.label
        optionElement.dataset.value = option.value
        optionElement.addEventListener("click", () => {
            select.selectValue(option.value)
            select.optionsCustomElement.classList.remove("show")
        })
        select.optionsCustomElement.append(optionElement)
    })

    // Append
    select.customElement.append(select.optionsCustomElement)

    // Show / Hide on click
    select.labelElement.addEventListener("click", () => {
        select.optionsCustomElement.classList.toggle('show')
    })

    // Close List on blur (lost focus, click or tab Off)
    select.customElement.addEventListener("blur", () => {
        select.optionsCustomElement.classList.remove('show')
    })

    // Keyboard control
    let debounceTimout
    let searchTerm = ""
    select.customElement.addEventListener("keydown", e => {
        switch (e.code) {

            // Open list
            case "Space":
                select.optionsCustomElement.classList.toggle('show')
                break;

            // Navigate
            case "ArrowUp": {
                const prevOption = select.options[select.selectedOptionIndex - 1]
                if (prevOption) { select.selectValue(prevOption.value) }
                break;
            }
            case "ArrowDown": {
                const nextOption = select.options[select.selectedOptionIndex + 1]
                if (nextOption) { select.selectValue(nextOption.value) }
                break;
            }
            // Close list
            case "Enter":
            case "Escape":
                select.optionsCustomElement.classList.remove('show')
                break;

            // Search by default
            default: {
                clearTimeout(debounceTimout)
                searchTerm += e.key
                debounceTimout = setTimeout(() => {
                    searchTerm = ""
                }, 600)

                const searchedOption = select.options.find(option => {
                    return option.label.toLowerCase().startsWith(searchTerm)
                })
                if (searchedOption) { select.selectValue(searchedOption.value) }
            }
        }
    })
}


/**
 * Get the select Options and formatted it to an Object
 * 
 * @param {Object} optionElements Dom HTML Options from select Object
 */
function getFormattedOptions(optionElements) {

    // Map array of Options from Select, and return option
    return [...optionElements].map(optionElement => {
        return {
            value: optionElement.value,
            label: optionElement.label,
            selected: optionElement.selected,
            element: optionElement
        }
    })

}