DECLARE @strUserID dbo.udtUserID = 'WebFormDeploy'

MERGE
INTO dbo.Document AS t USING (VALUES(
'DS-001' -- Document code (this has to be unique) -- Required
, 'CMHA-CE DischargeSummary Letter' -- Document Name -- Required
, 'CustomDocs/CMHACE/DischargeSummary/DischargeSummaryLetter' -- Document UC Path  -- Required
)
) AS s (DocumentCd, DocumentName, DocumentUCPath)
ON (t.DocumentCd = s.DocumentCd)
WHEN MATCHED
    THEN UPDATE
        SET
            DocumentName = s.DocumentName
           ,DocumentUCPath = s.DocumentUCPath
           ,DateUpdated = SYSDATETIME()
           ,WhoUpdated = @strUserID
WHEN NOT MATCHED
    THEN INSERT (DocumentCd, DocumentName, DocumentVersion, DocumentVersionDesc, DocumentDesc, DocumentLinkPath, DocumentBlob, DocumentBlobContentType, DocumentUCPath, XMLTemplate, DocumentTypeID, DocumentCategoryID, IsActive, AllowDigitalSignature, RequiresApproval, RequiresQA, QAID, AllowForCommonGroupDocument, ApprovalSpName, SubmissionSpName, DateInserted, DateUpdated, WhoInserted, WhoUpdated, SignSPName, SaveSPName, CustomHeader, CustomFooter, ReadyForAutoApproval, AutoApprove, AfterApprovalSPName, AfterQAApprovalSPName, MarginLeft, MarginRight, MarginTop, MarginBottom, IsLandscape, OriginalFileName, IncludeScore, MonthsTillExpiry, LinkedURL, CustomHeaderOption, CustomFooterOption, HTMLHeaderOption, UnreadTracking, OnlyShowWhenApproved, RAICode, AllowUseOnLockedEnrollment, AllowOnActionList, IncludePrintKeyOnPrint, AllowForProgram, AllowForAdmission, AllowForIntake)
        VALUES
            (s.DocumentCd, s.DocumentName, 
            1 /*s.DocumentVersion*/, 
            '' /*s.DocumentVersionDesc*/, 
            '' /*s.DocumentDesc*/, 
            '' /*s.DocumentLinkPath*/, 
            NULL /*s.DocumentBlob*/, 
            '' /*s.DocumentBlobContentType*/, 
            s.DocumentUCPath, 
            '' /*s.XMLTemplate*/, 
            1 /*s.DocumentTypeID*/, 
            1 /*s.DocumentCategoryID*/, 
            1 /*s.IsActive*/, 
            1 /*s.AllowDigitalSignature*/, 
            0 /*s.RequiresApproval*/, 
            0 /*s.RequiresQA*/, 
            NULL /*s.QAID*/, 
            0 /*s.AllowForCommonGroupDocument*/, 
            '' /*s.ApprovalSpName*/, 
            '' /*s.SubmissionSpName*/, 
            SYSDATETIME(), SYSDATETIME(), @strUserID, @strUserID, 
            '' /*s.SignSPName*/, 
            '' /*s.SaveSPName*/, 
            '' /*s.CustomHeader*/, 
            '' /*s.CustomFooter*/, 
            0 /*s.ReadyForAutoApproval*/, 
            0 /*s.AutoApprove*/, 
            '' /*s.AfterApprovalSPName*/, 
            '' /*s.AfterQAApprovalSPName*/, 
            0.5 /*s.MarginLeft*/, 
            0.5 /*s.MarginRight*/, 
            0.5 /*s.MarginTop*/, 
            0.5 /*s.MarginBottom*/, 
            0 /*s.IsLandscape*/, 
            '' /*s.OriginalFileName*/, 
            0 /*s.IncludeScore*/, 
            NULL /*s.MonthsTillExpiry*/, 
            '' /*s.LinkedURL*/, 
            1 /*s.CustomHeaderOption*/, 
            1 /*s.CustomFooterOption*/,
            0 /*s.HTMLHeaderOption*/, 
            0 /*s.UnreadTracking*/,
            0 /*s.OnlyShowWhenApproved*/, 
            NULL /*s.RAICode*/,
            0 /*s.AllowUseOnLockedEnrollment*/, 
            0 /*s.AllowOnActionList*/,
            0 /*s.IncludePrintKeyOnPrint*/,
            1 /*s.AllowForProgram*/,
            0 /* s.AllowForAdmission*/,
            0 /*s.AllowForIntake*/);
