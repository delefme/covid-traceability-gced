
  // Client ID and API key from the Developer Console
  var CLIENT_ID = '83023496363-gniain3238ra6ku4bn93j6f6iffj5n1e.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyDmCmAyHLdaSVs8BOHwe33iXHJZ4JzA57o';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

  var authorizeButton = document.getElementById('authorize_button');
  var signoutButton = document.getElementById('signout_button');

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    }, function(error) {
      console.log(JSON.stringify(error, null, 2));
    });
  }

  function processHoraris(data) {
      console.log(data);
      onPageLoad(data);
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      getHorari(processHoraris);
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  function getHorari(loadHoraris) {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1sev-SiyeQN5wngCnZaKdIMuu6yd3Da_EqTs-K36r3Ow', // Google Spreadsheet: "Horaris GCED"
      range: 'Horari',
    }).then(function(response) {
      var rows = response.result.values;
      loadHoraris(rows);
    }, function(response) {
      console.warn(response.result.error.message);
    });
  }
