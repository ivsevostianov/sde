var number;
var fact;
var err_msg = 'An error occurred. Please try again.';

document.addEventListener('DOMContentLoaded', function() {
    function fetch_fact_1(n) {
        document.getElementById('number').innerText = n;
        fetch(`http://numbersapi.com/${n}`)
            .then(function(response) { return response.text() })
            .then(function(data) {
                document.getElementById('number-fact').innerText = data;
            })
            .catch(function(error) {
                console.error('Error fetching data:', error);
                document.getElementById('number-fact').innerText = err_msg;
            });
    }

    function fetch_fact_2() {
        fetch('http://numbersapi.com/random')
            .then(function(response) { return response.text() })
            .then(function(data) {
                var x = data.match(/\d+/);
                if(x) {
                    if(x[0]) {
                        number = x[0];
                    } else {
                        number = 'Unknown';
                    }
                } else {
                    number = 'Unknown';
                }
                document.getElementById('number').innerText = number;
                document.getElementById('number-fact').innerText = data;
            })
            .catch(function(error) {
                console.error('Error fetching data:', error);
                document.getElementById('number-fact').innerText = err_msg;
            });
    }

    function GetDateFACT(num) {
        if(typeof num === 'string' || typeof num === 'number') {
            if(num) {
                var n = parseInt(num, 10);
                if(n < 1) {
                    alert('Please enter a number between 1 and 31.');
                    return;
                }
                if(n > 31) {
                    alert('Please enter a number between 1 and 31.');
                    return;
                }

                var d = new Date(2020, 0);
                d.setDate(n);
                var m = d.getMonth() + 1;
                var day = d.getDate();

                fetch('http://numbersapi.com/' + m + '/' + day + '/date')
                    .then(function(response) { return response.text() })
                    .then(function(data) {
                        document.getElementById('numberFact').innerText = data;
                    })
                    .catch(function(error) {
                        console.error('Error fetching data:', error);
                        document.getElementById('numberFact').innerText = err_msg;
                    });
            } else {
                alert('Please enter a number.');
            }
        }
    }

    var btn1 = document.getElementById('fetchFact');
    if(btn1 != null) {
        btn1.onclick = function() {
            var num = document.getElementById('number').value;
            if(num) {
                window.location.href = 'result.html?number=' + num;
            } else {
                alert('Please enter a number.');
            }
        }
    }

    var btn2 = document.getElementById('fetchNewFact');
    if(btn2 != null) {
        btn2.onclick = function() {
            var num = document.getElementById('new-number').value;
            if(num) {
                fetch_fact_1(num);
            } else {
                alert('Please enter a number.');
            }
        }
    }

    var btn3 = document.getElementById('randomBtn');
    if(btn3 != null) {
        btn3.onclick = function() {
            window.location.href = 'random.html';
        }
    }

    var btn4 = document.getElementById('dateBtn');
    if(btn4 != null) {
        btn4.onclick = function() {
            window.location.href = 'date.html';
        }
    }

    var btn5 = document.getElementById('fetchNumberFact');
    if(btn5) {
        btn5.addEventListener('click', function() {
            GetDateFACT(document.getElementById('number').value);
        });
    }

    if(window.location.pathname.indexOf('random.html') !== -1) {
        fetch_fact_2();
        var btn6 = document.getElementById('fetchRandomFact');
        if(btn6 != null) {
            btn6.onclick = function() { fetch_fact_2(); }
        }
    }

    if(window.location.pathname.indexOf('result.html') !== -1) {
        try {
            var p = new URLSearchParams(window.location.search);
            var n = p.get('number');
            if(n) {
                fetch_fact_1(n);
            } else {
                document.getElementById('number').innerText = 'Error';
                document.getElementById('number-fact').innerText = 'No number provided.';
            }
        } catch(e) {
            document.getElementById('number').innerText = 'Error';
            document.getElementById('number-fact').innerText = 'No number provided.';
        }
    }
});

function helper() {
    return document.getElementById('number').value || '';
}