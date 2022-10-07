define([
  "require",
  "exports",
  "jquery",
  "lodash",
  "marionette",
  "common",
  "security",
  "moment",
  "text!./DischargeSummaryLetter-EN.html",
], function (
  require,
  exports,
  $,
  _,
  Marionette,
  common,
  security,
  moment,
  templates
) {
  "use strict";
  var $templates = $(templates);
  //#region model
  var DocumentModel = common.Model.extend({
    idAttribute: "EnrollmentDocumentID", //Always will be EnrollmentDocumentID
    defaults() {
      // defautls for all captured data fields
      return {
        //Client Information Region
        ClientName: "",
        DateofBirth: "",
        Address: "",
        CityNm: "",
        ProvinceNm: "",
        PostalCode: "",
        Phone: "",
        allPrograms: [],
        timtebow: "",
        summary:"",
        caseGoals:"",
        discharge:"",
        uncompleted:"",
        //Enrollment Information Region
        EnrollmentName: "",
        EnrollmentNumber: "",
        ProgramNm: "",
        EnrollmentOpenDate: "",
        CaseFileNumber: "",

        //User Input Area
        UserInputDate: moment(),
        UserInputTime: moment(),
        StartedByID: 0,
        UserInputCheckbox: false,
        HiddenUserInput: "",
        UserRadioInput: "opt1",

        UserInput: "",
      };
    },
  });

  //#endregion

  var ClientInformationView = Marionette.ItemView.extend({
    name: "Client Information",
    template: common.loadTemplate("#clientInformationView", $templates),
    ui: {
      clientName: ".clientName",
      dateOfBirth: ".dateOfBirth",
      address: ".address",
      CityNm: ".CityNm",
      ProvinceNm: ".ProvinceNm",
      PostalCode: ".PostalCode",
      phone: ".phone",
      summary: 'input[name="summary"]',
      caseGoals: 'input[name="caseGoals"]',
      discharge: 'input[name="discharge"]',
      uncompleted: 'input[name="uncompleted"]',
    },
    bindings: {
      "@ui.clientName": "ClientName",
      "@ui.dateOfBirth": {
        observe: "DateofBirth",
        onGet(DoB) {
          if (DoB) {
            return moment(DoB).format("MM-DD-YYYY");
          }
          return "";
        },
      },
      "@ui.address": "Address",
      "@ui.CityNm": "CityNm",
      "@ui.ProvinceNm": "ProvinceNm",
      "@ui.PostalCode": "PostalCode",
      "@ui.phone": "Phone",
      "@ui.summary": "summary",
      "@ui.caseGoals": "caseGoals",
      "@ui.discharge": "discharge",
      "@ui.uncompleted": "uncompleted",
    },
    initialize() {
      //Do not remove this line.
      common.mixins.bind(this); // This is always required
    },
  });

  //#region Layout
  var MainDocument = Marionette.Layout.extend({
    name: "prototype",
    regions: {
      clientInformationRegion: ".clientInformationRegion",
    },
    template: common.loadTemplate("#demoDocumentView", $templates),
    initialize: function (options) {
      //This four lines are setuping the data structure
      var opts = options.DocumentXML;
      opts.AdmissionID = options.AdmissionID;
      opts.EnrollmentID = options.EnrollmentID;
      this.model = new DocumentModel(opts);

      this.clientInformationView = new ClientInformationView({
        model: this.model,
      });

      //Do not remove this line.
      common.mixins.bind(this); // This is always required
    },
    onShow() {
      this.clientInformationRegion.show(this.clientInformationView);
      let _this = this;
      let array = [
        {
          programName: "Situation Table",
          openDate: "",
          closeDate: "",
        },
        {
          programName: "Situation Table",
          openDate: "",
          closeDate: "",
        },
        {
          programName: "Situation Table",
          openDate: "",
          closeDate: "",
        },
        {
          programName: "Situation Table",
          openDate: "",
          closeDate: "",
        },
      ];
      $.each(array, function (index, value) {
        $("#table > tbody  ").append(
          "<tr>" +
            "<th>" +
            value.programName +
            "</th>" +
            "<th>" +
            value.openDate +
            "</th>" +
            "<th>" +
            value.closeDate +
            "</th>" +
            "</tr>"
        );
        console.log(index);
        console.log(value.programName);
      });
    },
    prefillClientID: function () {
      var _this = this;
      var that = this;
      common
        .ajax({
          url: config.baseApi + "Documents/WebUserControl/GetPrimaryClient",
          method: "POST",
          data: JSON.stringify({
            AdmissionID: this.model.get("AdmissionID"),
            EnrollmentID: this.model.get("EnrollmentID"),
          }),
          contentType: "application/json; charset=utf-8",
        })
        .done(function (response) {
          that.model.set({
            ClientID: response.data,
          });
          _this.prefillClientInformation();
        });
    },
    prefillClientInformation: function () {
      var _this = this;
      var clientID = this.model.get("ClientID");

      common.getJSON(
        config.baseApi + "Client/" + clientID,
        null,
        function (json) {
          json = json.results || json;

          var name =
            json.FirstName + " " + json.MiddleName + " " + json.LastName;
          _this.model.set({
            ClientName: name,
            DateofBirth: json.DateOfBirth,
          });
          common.getJSON(
            config.baseApi + "MPI/" + clientID + "/Phones",
            null,
            function (json) {
              var phone = json[0];
              if (phone === undefined) {
                phone = {
                  PhoneTypeNm: "",
                  Phone: "",
                };
              }
              var strPhone = "";

              if (phone.PhoneTypeNm !== "" && phone.Phone !== "") {
                strPhone = phone.PhoneTypeNm + ": " + phone.Phone;
              }

              _this.model.set({
                Phone: strPhone,
              });

              common.getJSON(
                config.baseApi + "MPI/" + clientID + "/Addresses",
                null,
                function (json) {
                  var address = json[0];
                  if (address === undefined) {
                    address = {
                      Address: "",
                      CityNm: "",
                      ProvinceNm: "",
                      PostalCode: "",
                    };
                  }

                  //    var strAddress = address.Address + '\n' + address.CityNm + '\n' + address.ProvinceNm + '\n' + address.PostalCode;
                  _this.model.set({
                    Address: address.address,
                    CityNm: address.CityNm,
                    ProvinceNm: address.ProvinceNm,
                    PostalCode: address.PostalCode,
                    allPrograms: [
                      {
                        programName: "Situation Table",
                        openDate: "",
                        closeDate: "",
                      },
                      {
                        programName: "Situation Table",
                        openDate: "",
                        closeDate: "",
                      },
                      {
                        programName: "Situation Table",
                        openDate: "",
                        closeDate: "",
                      },
                      {
                        programName: "Situation Table",
                        openDate: "",
                        closeDate: "",
                      },
                    ],
                    timtebow: common.bindingHelpers.reference("Program", {
                      observe: "ProgramNm",
                      idField: "ProgramNm",
                    }),
                  });
                  // _this.prefillEnrollmentInformation();
                }
              );
            }
          );
        }
      );
    },
    // prefillEnrollmentInformation: function() {
    //     var _this = this;
    //     var enrollmentID = this.model.get('EnrollmentID');

    // 	common.getJSON(config.baseApi + 'Enrollment/' + enrollmentID, null, function (json) {
    //         _this.model.set({
    //             EnrollmentName: json.EnrollmentName,
    //             EnrollmentNumber: json.EnrollmentNumber,
    //             ProgramNm: json.ProgramNm,
    //             EnrollmentOpenDate: json.EnrollmentOpenDate,
    //             AdmissionID: json.AdmissionID
    //         });
    //         // _this.prefillAdmissionInformation();
    //     });
    // },
    // prefillAdmissionInformation: function(){
    //     var _this = this;
    //     common.getJSON(config.baseApi + 'Admission/' + _this.model.get('AdmissionID'), null, function (json) {
    //         _this.model.set({
    //             CaseFileNumber: json.CaseFileNumber,
    //             AdmissionDate: json.AdmissionDate,
    //         });
    //     });
    // },

    /**
     * Optional Methods.
     */
    isValid: function () {
      return []; //Only return this so the document can save
    },
    isValidToSign: function () {
      return []; //Only return this so the document can save
    },

    /**
     * Required Methods.
     */
    prefillForm: function () {
      // First grab all the Client Information
      if (this.model.isNew()) {
        // Is this a new document?
        this.prefillClientID();
      }

      if (!this.model.isNew() || this._prefillAlreadyRun) {
        return;
      }

      this._prefillAlreadyRun = true;
    },
    //note: this function should not be changed.
    getData: function () {
      return { Data: this.model.toJSON() };
    },
  });
  return MainDocument;
});
