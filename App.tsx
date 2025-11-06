import { useState, useEffect } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Badge } from './components/ui/badge';
import { IdentityForm } from './components/IdentityForm';
import { PythonTest } from './components/PythonTest';
import { InterviewTest } from './components/InterviewTest';
import { ResultsDashboard } from './components/ResultsDashboard';
import { FeedbackComponent } from './components/FeedbackComponent';
import { HistoryView } from './components/HistoryView';
import { Brain, Users, Code, MessageSquare, Trophy, ArrowRight, History } from 'lucide-react';

type Step = 'welcome' | 'identity' | 'python' | 'interview' | 'results' | 'feedback' | 'history';

interface UserData {
  name: string;
  birthDate: string;
  birthPlace: string;
  jobPosition: string;
  cv?: File;
  portfolio?: File;
  pythonScore?: number;
  interviewScore?: number;
  overallScore?: number;
}

interface HistoryRecord extends UserData {
  id: string;
  completedAt: string;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    birthDate: '',
    birthPlace: '',
    jobPosition: '',
  });
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('interviewHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Save to history when feedback is completed
  const saveToHistory = () => {
    const newRecord: HistoryRecord = {
      ...userData,
      id: Date.now().toString(),
      completedAt: new Date().toISOString(),
    };
    
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('interviewHistory', JSON.stringify(updatedHistory));
  };

  const steps = [
    { id: 'welcome', title: 'Selamat Datang', icon: Users },
    { id: 'identity', title: 'Data Diri', icon: Users },
    { id: 'python', title: 'Tes Python', icon: Code },
    { id: 'interview', title: 'Interview', icon: MessageSquare },
    { id: 'results', title: 'Hasil', icon: Trophy },
    { id: 'feedback', title: 'Feedback', icon: Brain },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = currentStep === 'welcome' ? 0 : ((currentStepIndex) / (steps.length - 1)) * 100;

  const handleNextStep = () => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id as Step);
    }
  };

  const handleDataUpdate = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <Brain className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-4xl text-primary">AI Interview Simulator</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Platform simulasi interview kerja berbasis AI yang akan membantu Anda mempersiapkan diri untuk interview impian Anda. 
                Dapatkan pengalaman interview yang realistis dengan feedback yang mendalam.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Card className="p-6 text-center space-y-3">
                <Users className="w-8 h-8 mx-auto text-primary" />
                <h3>Data Diri</h3>
                <p className="text-sm text-muted-foreground">Input profil dan dokumen pendukung</p>
              </Card>
              <Card className="p-6 text-center space-y-3">
                <Code className="w-8 h-8 mx-auto text-primary" />
                <h3>Tes Programming</h3>
                <p className="text-sm text-muted-foreground">Evaluasi kemampuan Python Anda</p>
              </Card>
              <Card className="p-6 text-center space-y-3">
                <MessageSquare className="w-8 h-8 mx-auto text-primary" />
                <h3>Interview AI</h3>
                <p className="text-sm text-muted-foreground">Interview teks dan voice dengan AI</p>
              </Card>
              <Card className="p-6 text-center space-y-3">
                <Trophy className="w-8 h-8 mx-auto text-primary" />
                <h3>Hasil & Feedback</h3>
                <p className="text-sm text-muted-foreground">Analisis performa dan saran perbaikan</p>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={handleNextStep} size="lg" className="gap-2">
                Mulai Interview <ArrowRight className="w-4 h-4" />
              </Button>
              {history.length > 0 && (
                <Button 
                  onClick={() => setCurrentStep('history')} 
                  size="lg" 
                  variant="outline" 
                  className="gap-2"
                >
                  <History className="w-4 h-4" />
                  Lihat Riwayat ({history.length})
                </Button>
              )}
            </div>
          </div>
        );
      
      case 'identity':
        return (
          <IdentityForm 
            userData={userData} 
            onUpdate={handleDataUpdate} 
            onNext={handleNextStep} 
          />
        );
      
      case 'python':
        return (
          <PythonTest 
            onComplete={(score) => {
              handleDataUpdate({ pythonScore: score });
              handleNextStep();
            }} 
          />
        );
      
      case 'interview':
        return (
          <InterviewTest 
            userData={userData}
            onComplete={(score) => {
              handleDataUpdate({ interviewScore: score });
              handleNextStep();
            }} 
          />
        );
      
      case 'results':
        return (
          <ResultsDashboard 
            userData={userData} 
            onNext={handleNextStep} 
          />
        );
      
      case 'feedback':
        return (
          <FeedbackComponent 
            userData={userData} 
            onRestart={() => {
              saveToHistory();
              setCurrentStep('welcome');
              setUserData({
                name: '',
                birthDate: '',
                birthPlace: '',
                jobPosition: '',
              });
            }}
          />
        );
      
      case 'history':
        return (
          <HistoryView 
            history={history}
            onBack={() => setCurrentStep('welcome')}
            onClearHistory={() => {
              setHistory([]);
              localStorage.removeItem('interviewHistory');
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      {currentStep !== 'welcome' && (
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg">AI Interview Simulator</h2>
                <Badge variant="secondary">
                  {steps.find(s => s.id === currentStep)?.title}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}