const idsFormulari = {
    room: "430644487",
    day: "969387026_day",
    month: "969387026_month",
    year: "969387026_year",
    begins: "1247556644",
    ends: "1129822799",
    rows: {
        1: "54765492",
        2: "1930763724",
        3: "2120264882",
        4: "461426864",
        5: "384404927",
        6: "425665257",
        7: "1250957997",
        8: "808906937",
        9: "1138441160",
        10: "48654110",
        11: "980501094",
        12: "1347864676",
        13: "7665354",
        14:"339318881",
    },
    notes: "2023304730"
};

const formBaseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdEgitRtL-e5XbKktWrQMZUC5FlmcGVYrTArMh_Xw-SDLW8Iw/viewform";

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
    
    var elements;
    elements = document.getElementsByClassName("button");
    Array.from(elements).forEach(function(element) {
        element.addEventListener('click', clickButton);
        element.parent = element.parentNode.id;
    });
    elements = document.getElementsByClassName("complex-button");
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

function randInt(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function todayAt(hourSTR) {
    var now = new Date; // now
    var hour = hourSTR.split(":");
    
    now.setHours(hour[0]);   // set hours to 0
    now.setMinutes(hour[1]); // set minutes to 0
    now.setSeconds(0); // set seconds to 0
    
    return Math.floor(now / 1000); // UNIX TIMESTAMP
}

function processClasses(apiData) {
    let classesJSON = [];
    var classe;
    
    for (let i = 1; i < apiData.length; ++i) {
        classe = apiData[i];
        classesJSON.push({
            id: randInt(1, 999999), // TODO - de moment així
            calendar_name: classe[0],
            room: classe[1],
            begins: todayAt(classe[5]),
            ends: todayAt(classe[6]),
            subject_id: randInt(1, 999999), // TODO - de moment així
            friendly_name: classe[0],
            is_current: 1,          // Passem
            user_subject_id: null,  // Passem
            user_selected: false,   // Passem
        });
    }
    
    return classesJSON;
}

function onPageLoad(apiData) {
    /*
    var classesProva = [
       {
          "id":"168",
          "calendar_name":"\u00e0lgebra lineal (m-a)",
          "room":"A4002",
          "begins":"1601535600",
          "ends":"1601539200",
          "subject_id":"35",
          "friendly_name":"AP1 10 T",
          "is_current":"1",
          "user_subject_id":null,
          "user_selected":false
       },
       {
          "id":"169",
          "calendar_name":"\u00e0lgebra lineal (m-b)",
          "room":"A5202",
          "begins":"1601535600",
          "ends":"1601539200",
          "subject_id":"69",
          "friendly_name":"LMD 10 T",
          "is_current":"1",
          "user_subject_id":null,
          "user_selected":false
       },
       {
          "id":"173",
          "calendar_name":"c\u00e0lcul integral (m-a)",
          "room":"A6102",
          "begins":"1601535600",
          "ends":"1601539200",
          "subject_id":"33",
          "friendly_name":"TEOI 10 T",
          "is_current":"1",
          "user_subject_id":null,
          "user_selected":false
       },
       {
          "id":"172",
          "calendar_name":"programaci\u00f3 matem\u00e0tica (m-b)",
          "room":"A4105",
          "begins":"1601535600",
          "ends":"1601539200",
          "subject_id":"68",
          "friendly_name":"ARAP 11 L",
          "is_current":"1",
          "user_subject_id":null,
          "user_selected":false
       },
       {
          "id":"170",
          "calendar_name":"teoria de galois",
          "room":"A5103",
          "begins":"1601535600",
          "ends":"1601539200",
          "subject_id":"39",
          "friendly_name":"TAED2 11 L",
          "is_current":"1",
          "user_subject_id":null,
          "user_selected":false
       }
    ];
    */
    
    let processedClasses = processClasses(apiData);
    
    if (processedClasses.length == 0) {
        document.getElementById('no-subjects').classList.remove('hidden');
    } else {
        repeated_subjects = findRepeatedSubjects(processedClasses);
        buildSubjectContainer(processedClasses, repeated_subjects);
        document.getElementById('fme-maps-container').classList.remove('hidden');
    }
}

function sendForm() {
    
    // TODO - Canviar a les dades reals
    var room = "A4002";
    var day = "24";
    var month = "03";
    var year = "2020";
    var begins = "10:00";
    var ends = "12:00";
    var number = "6";
    var letter = "B";

    var params = new URLSearchParams();
    params.append("entry." + idsFormulari.room, room);
    params.append("entry." + idsFormulari.day, day);
    params.append("entry." + idsFormulari.month, month);
    params.append("entry." + idsFormulari.year, year);
    params.append("entry." + idsFormulari.begins, begins);
    params.append("entry." + idsFormulari.ends, ends);
    params.append("entry." + idsFormulari.rows[number], letter);

    var formulari_link = formBaseUrl + '?' + params.toString() + '#i1';
    window.location.href = formulari_link;

    /*
    var begins = new Date(parseInt(final_JSON.class.begins)1000);
    var ends = new Date(parseInt(final_JSON.class.ends)1000);

    var params = new URLSearchParams();
    params.append("entry." + idsFormulari.room, final_JSON.class.room); // class, number, letter
    params.append("entry." + idsFormulari.day, begins.getFullYear().toString() + '-' + (begins.getMonth() + 1).toString().padStart(2, "0") + '-' + begins.getDate().toString().padStart(2, "0"));
    params.append("entry." + idsFormulari.begins, formatDate(begins));
    params.append("entry." + idsFormulari.ends, formatDate(ends));
    params.append("entry." + idsFormulari.rows[final_JSON.letter], 'Columna ' + final_JSON.number);

    var formulari_link = formBaseUrl + '?' + params.toString() + '#i1';
    window.location.href = formulari_link;
    */

}


function addEventListeners() {
    // window.addEventListener('load', onPageLoad);

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
