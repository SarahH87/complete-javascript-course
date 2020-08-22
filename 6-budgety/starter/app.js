// BUDGET CONTROLLER
var budgetController = (function() {
    
    //function constructors
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };


    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    }

    return {
        addItem: function(type, descr, value) {
            var newItem, ID;

            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if(type === 'exp') {
                newItem = new Expense(ID, descr, value);
            } else if(type === 'inc') {
                newItem = new Income(ID, descr, value);
            }

            data.allItems[type].push(newItem);

            return newItem;
 
        },

        calculateBudget: function() {
            //calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            //calculate budget (income - expenses)
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the % of income we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.percentage/data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            };
        },
        

        testing: function() {
            console.log(data);
        }
    };
    
})();

// UI CONTROLLER
var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //all html inserted as last child of containers
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },


        getDOMstrings: function() {
            return DOMstrings;
        }

    }
    
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();
    
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
    }

    var updateBudget = function() {
        //calculate the budget
        budgetCtrl.calculateBudget();

        //return the budget
        var budget = budgetCtrl.getBudget();

        //display the budget on the ui
        console.log(budget);
    }

    var ctrlAddItem = function() {
        var input, newItem;
        input = UICtrl.getInput();

        if(input.description != "" && !isNaN(input.value) && input.value > 0) {
        
            newItem = budgetController.addItem(input.type, input.description, input.value);

            UICtrl.addListItem(newItem, input.type);
    
            UICtrl.clearFields();
    
            //calculate and update budget
            updateBudget();
        }

    };

    return {
        init: function() {
            console.log('Application started');
            setUpEventListeners();
        }
    }

    
})(budgetController, UIController);

controller.init();