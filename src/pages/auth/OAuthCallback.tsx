
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useOAuthCallback } from '@/hooks/useOAuthCallback';
import OAuthStatus from '@/components/auth/OAuthStatus';
import OAuthActions from '@/components/auth/OAuthActions';

const OAuthCallback = () => {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();
  
  const {
    status,
    errorMessage,
    detailedError,
    connectionDetails
  } = useOAuthCallback(platform);

  const handleRetry = () => {
    navigate('/dashboard/social');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <OAuthStatus
            status={status}
            errorMessage={errorMessage}
            detailedError={detailedError}
            connectionDetails={connectionDetails}
          />
          
          <OAuthActions
            status={status}
            onRetry={handleRetry}
            onGoToDashboard={handleGoToDashboard}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
