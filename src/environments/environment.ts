export const environment = {
  production: false,
  AuthTokenKeyLSKey: 'AuthToken',

  // //ApiEndPoint: "https://localhost:7043/api/",
  ImagesHeader: 'https://tele-med-dev.azurewebsites.net',
  // // // ImagesHeader: 'https://localhost:7043',
  ApiEndPoint: 'https://tele-med-dev.azurewebsites.net/api/',
  AngEndPoint: 'https://telemed-ang-dev.azurewebsites.net',

  // ImagesHeader:'https://telemed-api-prod.azurewebsites.net',
  // ApiEndPoint:'https://telemed-api-prod.azurewebsites.net/api/',
  //comment for testing
 

  // ApiEndPoint : "https://telemed-ang-dev.azurewebsites.net/api/",
  //ApiEndPoint : "https://tele-med-uat.azurewebsites.net/api/",
  // ApiEndPoint : "https://telemed-ang-uat.azurewebsites.net",
  // ApiEndPoint: 'https://medteleapi.azurewebsites.net/api/',

  // ImagesHeader: 'http://192.168.29.123/teleapi/',
  // ApiEndPoint: 'http://192.168.29.123/teleapi/api/',
  // AngEndPoint: 'http://medteleang.azurewebsites.net/',

  //   ImagesHeader: 'https://telemeduat1.azurewebsites.net',
  // ApiEndPoint: 'https://telemeduat1.azurewebsites.net/api/',
  // AngEndPoint: 'http://medteleang.azurewebsites.net/',

  // ImagesHeader: 'https://localhost:7043',
  // ApiEndPoint: 'https://localhost:7043/api/',
  // AngEndPoint: ' http://localhost:4200',

  // AngEndPoint: 'http://medteleang.azurewebsites.net/',
// This one is for production release.
  // jitsi_baseurl: 'https://api.jitsi.pawanshreemedtech.com',
  // jitsi_domain: 'test.pawanshreemedtech.com',

  // this one is for dev and uat release.
  // jitsi_baseurl: 'https://api.jitsi.pawanshreemedtech.com',
  jitsi_domain: 'uat.test.pawanshreemedtech.com',
  EncyptionKey: 'TeleMED@8765@!98',
  EndPoints: {
    Login: 'LoginUserWithToken',
    LogoutFromOtherDevice: 'logout-from-other-device',
    LogOutUser: 'logout',
    GetUserDetails: 'GetUserDetails',
    UpdateUserPassword: 'UpdateUserPassword',
    IsUserLoggedIn: 'IsUserLoggedIn',
    Patient: {
      Endpoint: 'Patient/',
      methods: {
        GetTodaysPatientCount: 'GetTodaysPatientCount',
        GetConsultedPatient: 'GetConsultedPatient',
        GetTodaysPatient: 'GetTodaysPatient',
        GetTodaysSearchedPatients: 'GetTodaysSearchedPatients',
        AddPatient: 'AddPatient',
        GetYesterdaysPatient: 'GetYesterdaysPatient',
        AdvanceSearchResult: 'AdvanceSearchResult',
        GetSuggestedSpecializations: 'GetSuggestedSpecializations',
        GetPatientImageFile: 'GetPatientImageFile',
      },
    },
    search: {
      Endpoint: 'search/',
      methods: {
        search: 'search',
      },
    },

    HolidayCalender: {
      Endpoint: 'HolidayCalender/',
      methods: {
        GetHolidayList: 'GetHolidayList',
        AddHoliday: 'AddHoliday',
        DeleteHoliday: 'DeleteHoliday',
      },
    },
    Doctor: {
      Endpoint: 'Doctor/',
      methods: {
        //post
        GetListOfNotification: 'GetListOfNotification',
        //get
        GetCDSSGuideLines: 'GetCDSSGuideLines',
        //post
        GetDoctorDetails: 'GetDoctorDetails',
        //get
        GetListOfMedicine: 'GetListOfMedicine',
        //get
        GetListOfVital: 'GetListOfVital',
        //get
        GetListOfPHCHospital: 'GetListOfPHCHospital',
        //get
        GetListOfSpecializationMaster: 'GetListOfSpecializationMaster',
        //get
        GetListOfSubSpecializationMaster: 'GetListOfSubSpecializationMaster',
        //post
        UpdateDoctorDetails: 'UpdateDoctorDetails',
        //post
        GetTodayesPatients: 'GetTodayesPatients',
        //post
        GetCompletedConsultationPatientsHistory:
          'GetCompletedConsultationPatientsHistory',
        //post
        GetYesterdayPatientsHistory: 'GetYesterdayPatientsHistory',
        //post
        GetPastPatientsHistory: 'GetPastPatientsHistory',
        //post
        GetPatientCaseDetailsAsync: 'GetPatientCaseDetailsAsync',
        //post
        PostTreatmentPlan: 'PostTreatmentPlan',
        //post
        DeleteNotification: 'DeleteNotification',
        //post
        EHRData: 'EHRData',
        //post
        PatientAbsent: 'PatientAbsent',
        //post
        ReferHigherFacility: 'ReferHigherFacility',
        //post
        GetCaseLabel: 'GetCaseLabel',
        //post
        SearchPatientDrDashBoard: 'SearchPatientDrDashBoard',
        //post
        SearchPatientDrHistory: 'SearchPatientDrHistory',
        //post
        GetListOfPHCHospitalBlockWise: 'GetListOfPHCHospitalBlockWise',

        //post
        GetLatestReferred: 'GetLatestReferred',
        //post
        GetLatestReferredCount: 'GetLatestReferredCount',
        //post
        UpdateIsDrOnline: 'UpdateIsDrOnline',
        //post
        IsDrOnline: 'IsDrOnline',
        //post
        OnlineDrList: 'OnlineDrList',
        //post
        AddDoctor: 'AddDoctor',
        //post
        AdvanceSearchResult: 'AdvanceSearchResult',
        //post
        SearchDoctorDetails: 'SearchDoctorDetails',
        //post
        GetAllDoctorEmails: 'GetAllDoctorEmails',

        //get
        CreatePrescription: 'CreatePrescription',
        CreatePrescriptionHTML: 'CreatePrescriptionHTML',
        GetPrescriptionFile: 'GetPrescriptionFile',
        GetDoctorCalendar: 'GetDoctorCalendar',
      },
    },
    PHC: {
      Endpoint: 'PHC/',
      methods: {
        GetPHCDetailsByUserID: 'GetPHCDetailsByUserID',
        GetPHCDetails: 'GetPHCDetails',
        GetPHCDetailById: 'GetPHCDetailsByID',
        GetPHCDetailsByEmailID: 'GetPHCDetailsByEmailID',
        GetAllPHC: 'GetAllPHC',
        AddEmployeeTraining: 'AddEmployeeTraining',
        UploadPHCDoc: 'UploadPHCDoc',
        AddPHC: 'AddPHC',
        SearchPHCDetailByName: 'SearchPHCDetailByName',
        GetAllPHCName: 'GetAllPHCName',
        GetPHCDetailByName: 'GetPHCDetailByName',
        UpdatePHCDetails: 'UpdatePHCDetails',
        UploadPHCDetails: 'UploadPHCDetails',
        GetDateWisePrescriptionNotGeneratedByPhcs:
          'GetDateWisePrescriptionNotGeneratedByPhcs',
      },
    },
    PatientCase: {
      Endpoint: 'PatientCase/',
      methods: {
        GetPatientCaseDetails: 'GetPatientCaseDetails',
        CreatePatientCase: 'CreatePatientCase',
        AddPatientCaseDetails: 'AddPatientCaseDetails',
        AddReferDoctorInPatientCase: 'AddReferDoctorInPatientCase',
        GetPatientCaseQueue: 'GetPatientCaseQueue',
        UploadCaseDoc: 'UploadCaseDoc',
        GetPatientCaseLevels: 'GetPatientCaseLevels',
        GetPatientCaseDetailsByCaseID: 'GetPatientCaseDetailsByCaseID',
        GetPatientCaseDocList: 'GetPatientCaseDocList',
        PostFeedback: 'PostFeedback',
        GetSelectedOnlineDoctors: 'GetSelectedOnlineDoctors',
        GetPatientQueue: 'GetPatientQueue',
        GetPatientQueueByDoctors: 'GetPatientQueueByDoctors',
        AddPatientInDoctorsQueue: 'AddPatientInDoctorsQueue',
        RemovePatientFromDoctorsQueue: 'RemovePatientFromDoctorsQueue',
        GetAllPHCPatientQueue: 'GetAllPHCPatientQueue',
        GetAllPandingPatientQueue: 'GetAllPandingPatientQueue',
        GetPatientCaseDoctorFeedback: 'GetPatientCaseDoctorFeedback',
        GetPatientQueueByDoctorID: 'GetPatientQueueByDoctorID',
        GetAllPendingPatientToDelete: 'GetAllPendingPatientToDelete',
        DeletePatientCase: 'DeletePatientCase',
        UpdatePatientCaseDoctorFeedback: 'UpdatePatientCaseDoctorFeedback',

        GetTotalCaseStatusAndSpecialityWise:
          'GetTotalCaseStatusAndSpecialityWise',
      },
    },
    UserMaster: {
      Endpoint: 'UserMaster/',
      methods: {
        GetUserRole: 'GetUserRole',
        LogedUserDetails: 'LogedUserDetails',
        ChangePassword: 'ChangePassword',
        UpdateUserLastAlive: 'UpdateUserLastAlive',
        AddUser: 'AddUser',
        GetAllGovUser: 'GetAllGovUser',
        DeleteUser: 'DeleteUser',
      },
    },
    Master: {
      Endpoint: 'Master/',
      methods: {
        GetAllCountryMaster: 'GetAllCountryMaster',
        GetAllDistrictMaster: 'GetAllDistrictMaster',
        GetAllIDProofTypeMaster: 'GetAllIDProofTypeMaster',
        GetAllGenderMaster: 'GetAllGenderMaster',
        GetAllStateMaster: 'GetAllStateMaster',
        GetAllBlockMaster: 'GetAllBlockMaster',
        GetAllMaritalStatus: 'GetAllMaritalStatus',
        GetAllPHC: 'GetAllPHC',
        GetDiagnosticTest: 'GetDiagnosticTest',
        GetAllDrugsName: 'GetAllDrugsName',
        GetBlocksByDistrictID: 'GetBlocksByDistrictID',
        GetBlocksByDistrictIDs: 'GetBlocksByDistrictIDs',
        SearchSnomedCTCodes: 'SearchSnomedCTCodes',
        GetDivisionsByClusterID: 'GetDivisionsByClusterID',
        GetDivisionsByClusterIDs: 'GetDivisionsByClusterIDs',
        GetAllClusterMaster: 'GetAllClusterMaster',
        GetDistrictsByDivisionID: 'GetDistrictsByDivisionID',
        GetDistrictsByDivisionIDs: 'GetDistrictsByDivisionIDs',
        GetAllSpecialization: 'GetAllSpecialization',
        GetAllCityMaster: 'GetAllCityMaster',
        GetPhcAccessByUserID: 'GetPhcAccessByUserID',
        GetPhcAccessMasterByUserID: 'GetPhcAccessMasterByUserID',
        GetAllUsersByUserTypeID: 'GetAllUsersByUserTypeID',
        GetIsPatientCreationActive: 'GetIsPatientCreationActive',
        SetIsPatientCreationActive: 'SetIsPatientCreationActive',
        AddEvent: 'AddEvent',
        GetEvent: 'GetEvent',
        GetApiDomians: 'GetApiDomians',
        GetReportDomians: 'GetReportDomians',
        GetAllUserTypeMaster: 'GetAllUserTypeMaster',
        GetReportNameByUserTypeID: 'GetReportNameByUserTypeID',
        AddReportAccessDetails: 'AddReportAccessDetails',
        GetReportAccessDetailsByUserID: 'GetReportAccessDetailsByUserID',
        GetReportAccessUrlByUserID: 'GetReportAccessUrlByUserID',
      },
    },
    Dashboard: {
      Endpoint: 'DashBoard/',
      methods: {
        DoctorsLoggedInToday: 'DoctorsLoggedInToday',
        LoggedUserInToday: 'LoggedUserInToday',
        GetLoggedUserCount: 'GetLoggedUserCount',
        GetTodaysTotalPatientCase: 'GetTodaysTotalPatientCase',
        GetTodaysPatientQueue: 'GetTodaysPatientQueue',
        GetDashboardConsultation: 'GetDashboardConsultation',
        GetDashboardReportSummary: 'GetDashboardReportSummary',
        GetDashboardReportSummaryMonthly: 'GetDashboardReportSummaryMonthly',
        GetPHCLoginHistoryReport: 'GetPHCLoginHistoryReport',
        GetPHCConsultationReport: 'GetPHCConsultationReport',
        GetPHCManpowerReport: 'GetPHCManpowerReport',
        GetDashboardReportConsultation: 'GetDashboardReportConsultation',
        AddEquipmentUptimeReport: 'AddEquipmentUptimeReport',
        GetPatientRegisterReport: 'GetPatientRegisterReport',
        GetReferredPatientReport: 'GetReferredPatientReport',
        GetReviewPatientReport: 'GetReviewPatientReport',
        GetDashboardEmployeeFeedback: 'GetDashboardEmployeeFeedback',
        GetDashboardSpokeMaintenance: 'GetDashboardSpokeMaintenance',
        GetDashboardAppointment: 'GetDashboardAppointment',
        GetDashboardEquipmentUptimeReport: 'GetDashboardEquipmentUptimeReport',
        GetDashboardDoctorAvgTime: 'GetDashboardDoctorAvgTime',
        GetDashboardDoctorAvailability: 'GetDashboardDoctorAvailability',
        GetDashboardEquipmentHeaderReport: 'GetDashboardEquipmentHeaderReport',
        GetPrescribedMedicine: 'GetPrescribedMedicine',
        GetDashboardDiagnosticPrescribedTestWise:
          'GetDashboardDiagnosticPrescribedTestWise',
        GetDashboardDiagnosticPrescribedPHCWise:
          'GetDashboardDiagnosticPrescribedPHCWise',
        GetPrescribedMedicinePHCWise: 'GetPrescribedMedicinePHCWise',
        GetDashboardGraph: 'GetDashboardGraph',
        GetDashboardFeedbackSummaryReport: 'GetDashboardFeedbackSummaryReport',
        GetDashboardFeedbackReport: 'GetDashboardFeedbackReport',
        GetDashboardDignosisSpecialityWise:
          'GetDashboardDignosisSpecialityWise',
        GetDashboardDiseasephcWise: 'GetDashboardDiseasephcWise',
        GetDashboardDiseaseAgeWise: 'GetDashboardDiseaseAgeWise',

        GetDashboardSystemHealthReport: 'GetDashboardSystemHealthReport',
        RemoteSiteDowntimeSummaryDaily: 'RemoteSiteDowntimeSummaryDaily',
        RemoteSiteDowntimeSummaryMonthly: 'RemoteSiteDowntimeSummaryMonthly',
        GetDashboardFeedbackSummaryReportData:
          'GetDashboardFeedbackSummaryReportData',
        GetDashboardDCMaintenance: 'GetDashboardDCMaintenance',
        AddPhcAccess: 'AddPhcAccess',
        AddPhcAccessMaster: 'AddPhcAccessMaster',
        GetDashboardFeedbackReportWithRestrictedAccess:
          'GetDashboardFeedbackReportWithRestrictedAccess',
        GetDashboardAppointmentWithRestrictedAccess:
          'GetDashboardAppointmentWithRestrictedAccess',
        GetDashboardReportConsultationWithRestrictedAccess:
          'GetDashboardReportConsultationWithRestrictedAccess',
        GetDashboardConsultationWithRestrictedAccess:
          'GetDashboardConsultationWithRestrictedAccess',
        GetDashboardDiagnosticPrescribedPHCWiseWithRestrictedAccess:
          'GetDashboardDiagnosticPrescribedPHCWiseWithRestrictedAccess',
        GetDashboardDiagnosticPrescribedTestWiseWithRestrictedAccess:
          'GetDashboardDiagnosticPrescribedTestWiseWithRestrictedAccess',
        GetDashboardDignosisSpecialityWiseWithRestrictedAccess:
          'GetDashboardDignosisSpecialityWiseWithRestrictedAccess',
        GetDashboardDiseaseAgeWiseWithRestrictedAccess:
          'GetDashboardDiseaseAgeWiseWithRestrictedAccess',
        GetDashboardDiseasephcWiseWithRestrictedAccess:
          'GetDashboardDiseasephcWiseWithRestrictedAccess',
        GetDashboardEmployeeFeedbackWithRestrictedAccess:
          'GetDashboardEmployeeFeedbackWithRestrictedAccess',
        GetDashboardEquipmentHeaderReportWithRestrictedAccess:
          'GetDashboardEquipmentHeaderReportWithRestrictedAccess',
        GetDashboardEquipmentUptimeReportWithRestrictedAccess:
          'GetDashboardEquipmentUptimeReportWithRestrictedAccess',
        GetDashboardFeedbackSummaryReportWithRestrictedAccess:
          'GetDashboardFeedbackSummaryReportWithRestrictedAccess',
        GetDashboardFeedbackSummaryReportDataWithRestrictedAccess:
          'GetDashboardFeedbackSummaryReportDataWithRestrictedAccess',
        GetDashboardGraphWithRestrictedAccess:
          'GetDashboardGraphWithRestrictedAccess',
        GetDashboardReportSummaryWithRestrictedAccess:
          'GetDashboardReportSummaryWithRestrictedAccess',
        GetDashboardReportSummaryMonthlyWithRestrictedAccess:
          'GetDashboardReportSummaryMonthlyWithRestrictedAccess',
        GetDashboardSpokeMaintenanceWithRestrictedAccess:
          'GetDashboardSpokeMaintenanceWithRestrictedAccess',
        GetDashboardDCMaintenanceWithRestrictedAccess:
          'GetDashboardDCMaintenanceWithRestrictedAccess',
        RemoteSiteDowntimeSummaryMonthlyWithRestrictedAccess:
          'RemoteSiteDowntimeSummaryMonthlyWithRestrictedAccess',
        RemoteSiteDowntimeSummaryDailyWithRestrictedAccess:
          'RemoteSiteDowntimeSummaryDailyWithRestrictedAccess',
        GetPHCConsultationReportWithRestrictedAccess:
          'GetPHCConsultationReportWithRestrictedAccess',
        GetPHCLoginHistoryReportWithRestrictedAccess:
          'GetPHCLoginHistoryReportWithRestrictedAccess',
        GetPHCManpowerReportWithRestrictedAccess:
          'GetPHCManpowerReportWithRestrictedAccess',
        GetPatientRegisterReportWithRestrictedAccess:
          'GetPatientRegisterReportWithRestrictedAccess',
        GetReviewPatientReportWithRestrictedAccess:
          'GetReviewPatientReportWithRestrictedAccess',
        GetReferredPatientReportWithRestrictedAccess:
          'GetReferredPatientReportWithRestrictedAccess',
        GetPrescribedMedicineWithRestrictedAccess:
          'GetPrescribedMedicineWithRestrictedAccess',
        GetPrescribedMedicinePHCWiseWithRestrictedAccess:
          'GetPrescribedMedicinePHCWiseWithRestrictedAccess',
        GetConsultedPatientsAsync: 'GetConsultedPatientsAsync',
        GetConsultedPatientsReportAsync: 'GetConsultedPatientsReportAsync',
        GetAppointedPatientListAsync: 'GetAppointedPatientListAsync',
        GetAppointedPatientsReportAsync: 'GetAppointedPatientsReportAsync',
        AppointmentPatientReportResultAsync:
          'AppointmentPatientReportResultAsync',
        GetHRManpowersAsync: 'GetHRManpowersAsync',
        GetHRExecutiveReportWithRestrictedAccess:
          'GetHRExecutiveReportWithRestrictedAccess',
      },
    },
    MIS: {
      Endpoint: 'MIS/',
      methods: {
        CompletedConsultation: 'CompletedConsultation',
        CompletedConsultationByDoctors: 'CompletedConsultationByDoctors',
        GetCompletedConsultationChart: 'GetCompletedConsultationChart',
      },
    },
    VideoCall: {
      Endpoint: 'videocall/',
      methods: {
        Token: 'token',
        ConnectToMeetingRoom: 'connecttomeetingroom',
        CreateRoomWithRecording: 'create-room-with-recording',
        CallingByPatientCaseId: 'callingbypatientcaseid',
        DismissCall: 'DismissCall',
        BeginDialingCallToUser: 'BeginDialingCallToUser',
        CaptureNetworkQuality: 'CaptureNetworkQuality',
        SignalRHandShake: 'SignalRHandShake',
      },
    },

    CDSSGuideline: {
      Endpoint: 'CDSSGuideline/',
      methods: {
        GetCDSSGuideLinesByDiseasesAndAge: 'GetCDSSGuideLinesByDiseasesAndAge',
        //Get
        GetCDSSGuidelineDiseasesByDiseasesAndAge:
          'GetCDSSGuidelineDiseasesByDiseasesAndAge',
      },
    },
  },
  Role: 'role',
  UserId: 'userId',
  BlockID: 'BlockID',
  patientId: 'patientId',
  doctorID: 'doctorID',
  doctorName: 'doctorName',
  PhcID: 'PhcID',
  PhcName: 'PhcName',
  doctorEmail: 'doctorEmail',
  patientName: 'patientName',
  referredbyPHCName: 'referredbyPHCName',
  RoomName: 'RoomName',
  RoomSid: 'RoomSid',
  username: 'username',
  pateintWaitRefereshtime: 'pateintWaitRefereshtime',
};
