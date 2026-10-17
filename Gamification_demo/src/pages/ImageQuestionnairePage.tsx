// src/pages/ImageQuestionnairePage.tsx
// Route wrapper — thin shim so App.tsx can import from pages/ like all other routes.
import React from 'react';
import ImageQuestionnairePage from '../imageQuestionnaire/ImageQuestionnairePage';

const ImageQuestionnairePageRoute: React.FC = () => {
    return <ImageQuestionnairePage />;
};

export default ImageQuestionnairePageRoute;
