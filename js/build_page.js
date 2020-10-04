const idsFormulari = {
    room: "1063142948",
    day: "2115504093",
    begins: "1749141911",
    ends: "1827359679",
    rows: {
        A: "208184485",
        B: "1077148310",
        C: "642851281",
        D: "1686039024",
        E: "697835787",
        F: "1511799646",
        G: "809853432",
        H: "182597499",
        I: "1890539481",
        J: "529159478",
        K: "1615241874",
        L: "1334263875"
    },
    notes: "1600275159"
};

const formBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfT9o287VqLyhwR8LPdloAQWhuqCgA3NfdhgP5vb9_sVQHL-g/viewform";

var final_JSON = {
    "class": null,
    "number": "",
    "letter": ""
};

var current_section = "section-1";

var repeated_subjects;

function fillInSummary() {
    var begins = new Date(parseInt(final_JSON.class.begins)*1000);
    var ends = new Date(parseInt(final_JSON.class.ends)*1000);

    document.getElementById('subject-final').textContent = final_JSON.class.friendly_name || final_JSON.class.calendar_name;
    document.getElementById('classroom-final').textContent = final_JSON.class.room;
    document.getElementById('date-final').textContent = begins.toLocaleDateString();
    document.getElementById('time-final').textContent = formatDate(begins) + ' - ' + formatDate(ends);
    document.getElementById('letter-final').textContent = final_JSON.letter;
    document.getElementById('number-final').textContent = final_JSON.number;
}

function clickButton(element) {
    var btn = element.currentTarget;
    var parent = btn.parent;

    if (parent == "subject-container") {
        // Canvi de background del button
        var selectedClass = JSON.parse(btn.getAttribute('data-class'));
        $("#subject-container .complex-button").removeClass("is-link")
        btn.classList.add("is-link");
        // Canvi JSON
        final_JSON["class"] = selectedClass;
        // Missatge advertència classe repetida
        if (repeated_subjects.has(selectedClass.id)) {
            document.getElementById('repeated-subject-warning').classList.remove('hidden');
            document.getElementById('repeated-subject-warning-class').textContent = selectedClass.room;
        } else {
            document.getElementById('repeated-subject-warning').classList.add('hidden');
        }
        // Anchor següent pregunta
        switchSection("section-2");
    } else if (parent == "number-container") {
        // Canvi de background del button
        $("#number-container .button").removeClass("is-link is-light is-active")
        btn.classList.add("is-link", "is-light", "is-active");
        // Canvi JSON
        final_JSON["number"] = btn.getAttribute('data-number');
        // Introducció de totes les dades al resum final
        fillInSummary();
        // Anchor següent pregunta
        switchSection("section-send");
    } else if (parent == "letter-container") {
        // Canvi de background del button
        $("#letter-container .button").removeClass("is-link is-light is-active")
        btn.classList.add("is-link", "is-light", "is-active");
        // Canvi JSON
        final_JSON["letter"] = btn.getAttribute('data-letter');
        // Anchor següent pregunta
        switchSection("section-3");
    }
}

function switchSection(s) {
    setTimeout(function(){ 
        document.getElementById(current_section).classList.add('hidden');
        document.getElementById(s).classList.remove('hidden');
        current_section = s;
    }, 75);
}

function findRepeatedSubjects(classes) {
    var rep = new Set();
    for (var [i, classe] of classes.entries()) {
        if (i > 0 && classes[i-1].calendar_name == classe.calendar_name) {
            rep.add(classe.id);
            rep.add(classes[i-1].id);
        }
    }
    return rep;
}

function buildSubjectContainer(classes, repeated) {
    for (var classe of classes) {
        var hora_inici = formatDate(new Date(parseInt(classe.begins)*1000));
        var hora_final = formatDate(new Date(parseInt(classe.ends)*1000));

        var classeDiv = document.createElement('div');
        classeDiv.classList.add('message', 'complex-button');
        classeDiv.id = 'subject-' + classe.subject_id + '-' + classe.room;
        classeDiv.setAttribute('data-class', JSON.stringify(classe));

        var header = document.createElement('div');
        header.classList.add('message-header');
        header.textContent = classe.friendly_name || classe.calendar_name;

        var body = document.createElement('div');
        body.classList.add('message-body');

        var div1 = document.createElement('div');
        var span = document.createElement('span');
        span.textContent = classe.room;

        if (repeated.has(classe.id)) {
            div1.classList.add('has-text-danger', 'has-text-weight-bold');
        }

        div1.textContent = 'Aula ';
        div1.appendChild(span);

        var div2 = document.createElement('div');
        div2.textContent = hora_inici + ' - ' + hora_final;

        body.appendChild(div1);
        body.appendChild(div2);

        classeDiv.appendChild(header);
        classeDiv.appendChild(body);

        document.getElementById("subject-container").appendChild(classeDiv);
    }

    var elements = document.getElementsByClassName("button");
    Array.from(elements).forEach(function(element) {
        element.addEventListener('click', clickButton);
        element.parent = element.parentNode.id;
    });
    var elements = document.getElementsByClassName("complex-button");
    Array.from(elements).forEach(function(element) {
        element.addEventListener('click', clickButton);
        element.parent = element.parentNode.id;
    });
}

function formatDate(d) {
    var str = "";
    str += d.getHours();
    str += ":";
    if (d.getMinutes() < 10) str += "0";
    str += d.getMinutes();
    return str;
}

function onPageLoad() {
    /*
    fetch(api_url + "getCurrentClasses", {
        "mode": "cors",
        "credentials": "include"
    })
        .then(response => response.json())
        .then(data => {
    */
    
    var classesProva = [
       {
          "id":"168",
          "calendar_name":"\u00e0lgebra lineal (m-a)",
          "room":"001",
          "begins":"1601535600",
          "ends":"1601539200",
          "subject_id":"35",
          "friendly_name":"\u00c0lgebra Lineal (A)",
          "is_current":"1",
          "user_subject_id":null,
          "user_selected":false
       },
       {
          "id":"169",
          "calendar_name":"\u00e0lgebra lineal (m-b)",
          "room":"002",
          "begins":"1601535600",
          "ends":"1601539200",
          "subject_id":"69",
          "friendly_name":"\u00c0lgebra Lineal (B)",
          "is_current":"1",
          "user_subject_id":null,
          "user_selected":false
       },
       {
          "id":"173",
          "calendar_name":"c\u00e0lcul integral (m-a)",
          "room":"S04",
          "begins":"1601535600",
          "ends":"1601539200",
          "subject_id":"33",
          "friendly_name":"C\u00e0lcul Integral (A)",
          "is_current":"1",
          "user_subject_id":null,
          "user_selected":false
       },
       {
          "id":"172",
          "calendar_name":"programaci\u00f3 matem\u00e0tica (m-b)",
          "room":"S03",
          "begins":"1601535600",
          "ends":"1601539200",
          "subject_id":"68",
          "friendly_name":"Programaci\u00f3 Matem\u00e0tica (B)",
          "is_current":"1",
          "user_subject_id":null,
          "user_selected":false
       },
       {
          "id":"170",
          "calendar_name":"teoria de galois",
          "room":"004",
          "begins":"1601535600",
          "ends":"1601539200",
          "subject_id":"39",
          "friendly_name":"Teoria de Galois",
          "is_current":"1",
          "user_subject_id":null,
          "user_selected":false
       }
    ];
    
    if (classesProva.length == 0) {
        document.getElementById('no-subjects').classList.remove('hidden');
    } else {
        repeated_subjects = findRepeatedSubjects(classesProva);
        buildSubjectContainer(classesProva, repeated_subjects);
        document.getElementById('fme-maps-container').classList.remove('hidden');
    }
    
    /*

        });
    */
}

function sendForm() {
    
    var begins = new Date(parseInt(final_JSON.class.begins)*1000);
    var ends = new Date(parseInt(final_JSON.class.ends)*1000);

    var params = new URLSearchParams();
    params.append("entry." + idsFormulari.room, final_JSON.class.room); // class, number, letter
    params.append("entry." + idsFormulari.day, begins.getFullYear().toString() + '-' + (begins.getMonth() + 1).toString().padStart(2, "0") + '-' + begins.getDate().toString().padStart(2, "0"));
    params.append("entry." + idsFormulari.begins, formatDate(begins));
    params.append("entry." + idsFormulari.ends, formatDate(ends));
    params.append("entry." + idsFormulari.rows[final_JSON.letter], 'Columna ' + final_JSON.number);

    var formulari_link = formBaseUrl + '?' + params.toString() + '#i1';
    window.location.href = formulari_link;

}


function addEventListeners() {
    window.addEventListener('load', onPageLoad);

    var elements = document.getElementsByClassName("button");
    Array.from(elements).forEach(function(element) {
        element.addEventListener('click', clickButton);
        element.parent = element.parentNode.id;
    });

    var elements = document.getElementsByClassName("complex-button");
    Array.from(elements).forEach(function(element) {
        element.addEventListener('click', clickButton);
        element.parent = element.parentNode.id;
    });

    document.getElementById("send-button").addEventListener('click', function (el) {
        document.getElementById("send-button").classList.add('is-loading');
        sendForm();
    });
}

addEventListeners();
