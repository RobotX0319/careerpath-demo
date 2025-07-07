/**
 * Integration Tests
 * 
 * Tests for component integration and data flow
 */

// Mock API responses
const mockApiResponses = {
  personalityTest: {
    success: true,
    data: {
      scores: {
        openness: 75,
        conscientiousness: 85,
        extraversion: 60,
        agreeableness: 80,
        neuroticism: 40
      },
      recommendations: ['Software Developer', 'Data Analyst', 'Project Manager']
    }
  },
  careerPaths: {
    success: true,
    data: [
      {
        id: 'software-development',
        title: 'Software Development',
        compatibility: 92
      },
      {
        id: 'data-science',
        title: 'Data Science',
        compatibility: 78
      }
    ]
  },
  userProfile: {
    success: true,
    data: {
      id: 'user123',
      name: 'Ali Valiyev',
      email: 'ali@example.com',
      completedTests: ['personality'],
      careerInterests: ['technology', 'innovation']
    }
  }
};

// Mock API client
class MockApiClient {
  async getPersonalityResults(userId: string) {
    await this.delay(500); // Simulate network delay
    return mockApiResponses.personalityTest;
  }
  
  async getCareerRecommendations(personalityScores: any) {
    await this.delay(300);
    return mockApiResponses.careerPaths;
  }
  
  async getUserProfile(userId: string) {
    await this.delay(200);
    return mockApiResponses.userProfile;
  }
  
  async updateUserProfile(userId: string, updates: any) {
    await this.delay(400);
    return {
      success: true,
      data: { ...mockApiResponses.userProfile.data, ...updates }
    };
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Mock state management
class MockStateManager {
  private state: any = {
    user: null,
    personalityResults: null,
    careerRecommendations: [],
    loading: false,
    error: null
  };
  
  private listeners: Function[] = [];
  
  getState() {
    return { ...this.state };
  }
  
  setState(updates: any) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }
  
  subscribe(listener: Function) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Integration test runner
let integrationTestCount = 0;
let integrationPassedTests = 0;
let integrationFailedTests = 0;

function runIntegrationTest(name: string, testFn: () => Promise<void>) {
  integrationTestCount++;
  testFn()
    .then(() => {
      console.log(`✅ ${name} - PASSED`);
      integrationPassedTests++;
    })
    .catch((error) => {
      console.error(`❌ ${name} - FAILED:`, error);
      integrationFailedTests++;
    });
}

function assertApiResponse(response: any, expectedKeys: string[]) {
  if (!response.success) {
    throw new Error('API response should be successful');
  }
  
  expectedKeys.forEach(key => {
    if (!(key in response.data)) {
      throw new Error(`API response should contain ${key}`);
    }
  });
}

function assertStateUpdate(oldState: any, newState: any, expectedChanges: string[]) {
  expectedChanges.forEach(key => {
    if (oldState[key] === newState[key]) {
      throw new Error(`State ${key} should have changed`);
    }
  });
}

// Test instances
const apiClient = new MockApiClient();
const stateManager = new MockStateManager();

// Integration tests
runIntegrationTest('User authentication flow', async () => {
  // Simulate login
  stateManager.setState({ loading: true });
  
  const userResponse = await apiClient.getUserProfile('user123');
  assertApiResponse(userResponse, ['id', 'name', 'email']);
  
  const oldState = stateManager.getState();
  stateManager.setState({
    user: userResponse.data,
    loading: false
  });
  
  const newState = stateManager.getState();
  assertStateUpdate(oldState, newState, ['user', 'loading']);
  
  console.log('   ✓ User authentication flow completed');
});

runIntegrationTest('Personality test completion flow', async () => {
  // Simulate test completion
  stateManager.setState({ loading: true });
  
  const testResponse = await apiClient.getPersonalityResults('user123');
  assertApiResponse(testResponse, ['scores', 'recommendations']);
  
  const oldState = stateManager.getState();
  stateManager.setState({
    personalityResults: testResponse.data,
    loading: false
  });
  
  const newState = stateManager.getState();
  assertStateUpdate(oldState, newState, ['personalityResults', 'loading']);
  
  console.log('   ✓ Personality test completion flow completed');
});

runIntegrationTest('Career recommendation generation', async () => {
  // Get personality scores first
  const personalityResponse = await apiClient.getPersonalityResults('user123');
  const scores = personalityResponse.data.scores;
  
  // Generate career recommendations
  stateManager.setState({ loading: true });
  
  const careerResponse = await apiClient.getCareerRecommendations(scores);
  assertApiResponse(careerResponse, ['data']);
  
  if (!Array.isArray(careerResponse.data)) {
    throw new Error('Career recommendations should be an array');
  }
  
  const oldState = stateManager.getState();
  stateManager.setState({
    careerRecommendations: careerResponse.data,
    loading: false
  });
  
  const newState = stateManager.getState();
  assertStateUpdate(oldState, newState, ['careerRecommendations', 'loading']);
  
  console.log('   ✓ Career recommendation generation completed');
});

runIntegrationTest('Profile update flow', async () => {
  const updates = {
    name: 'Ali Valiyev Updated',
    careerInterests: ['technology', 'innovation', 'leadership']
  };
  
  stateManager.setState({ loading: true });
  
  const updateResponse = await apiClient.updateUserProfile('user123', updates);
  assertApiResponse(updateResponse, ['id', 'name', 'email']);
  
  if (updateResponse.data.name !== updates.name) {
    throw new Error('Profile name should be updated');
  }
  
  const oldState = stateManager.getState();
  stateManager.setState({
    user: updateResponse.data,
    loading: false
  });
  
  const newState = stateManager.getState();
  assertStateUpdate(oldState, newState, ['user', 'loading']);
  
  console.log('   ✓ Profile update flow completed');
});

runIntegrationTest('Error handling integration', async () => {
  // Simulate API error
  const originalMethod = apiClient.getUserProfile;
  apiClient.getUserProfile = async () => {
    throw new Error('Network error');
  };
  
  try {
    stateManager.setState({ loading: true, error: null });
    
    await apiClient.getUserProfile('user123');
    throw new Error('Should have thrown an error');
  } catch (error) {
    const oldState = stateManager.getState();
    stateManager.setState({
      loading: false,
      error: (error as Error).message
    });
    
    const newState = stateManager.getState();
    
    if (newState.loading !== false) {
      throw new Error('Loading should be false after error');
    }
    
    if (!newState.error) {
      throw new Error('Error should be set in state');
    }
    
    console.log('   ✓ Error handling integration completed');
  }
  
  // Restore original method
  apiClient.getUserProfile = originalMethod;
});

runIntegrationTest('State subscription mechanism', async () => {
  let notificationCount = 0;
  let lastState: any = null;
  
  // Subscribe to state changes
  const unsubscribe = stateManager.subscribe((state: any) => {
    notificationCount++;
    lastState = state;
  });
  
  // Make some state changes
  stateManager.setState({ test: 'value1' });
  stateManager.setState({ test: 'value2' });
  stateManager.setState({ test: 'value3' });
  
  // Give some time for async notifications
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (notificationCount !== 3) {
    throw new Error(`Expected 3 notifications, got ${notificationCount}`);
  }
  
  if (!lastState || lastState.test !== 'value3') {
    throw new Error('Last state should contain the final update');
  }
  
  // Test unsubscribe
  unsubscribe();
  stateManager.setState({ test: 'value4' });
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (notificationCount !== 3) {
    throw new Error('Should not receive notifications after unsubscribe');
  }
  
  console.log('   ✓ State subscription mechanism completed');
});

runIntegrationTest('Data validation integration', async () => {
  // Test invalid data handling
  const invalidPersonalityData = {
    scores: {
      openness: 150, // Invalid: should be 0-100
      conscientiousness: -10, // Invalid: should be 0-100
      extraversion: 'invalid', // Invalid: should be number
    }
  };
  
  // Simulate validation
  const validatePersonalityScores = (scores: any) => {
    const errors: string[] = [];
    
    Object.entries(scores).forEach(([key, value]) => {
      if (typeof value !== 'number') {
        errors.push(`${key} should be a number`);
      } else if (value < 0 || value > 100) {
        errors.push(`${key} should be between 0 and 100`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  const validation = validatePersonalityScores(invalidPersonalityData.scores);
  
  if (validation.isValid) {
    throw new Error('Validation should fail for invalid data');
  }
  
  if (validation.errors.length !== 3) {
    throw new Error(`Expected 3 validation errors, got ${validation.errors.length}`);
  }
  
  console.log('   ✓ Data validation integration completed');
});

// Wait for all async tests to complete
setTimeout(() => {
  console.log('\n🧪 All integration tests completed!');
  console.log(`📊 Integration Test Summary: ${integrationPassedTests}/${integrationTestCount} passed, ${integrationFailedTests} failed`);
  
  if (integrationFailedTests === 0) {
    console.log('🎉 All integration tests passed successfully!');
  } else {
    console.log('⚠️  Some integration tests failed. Please check the errors above.');
  }
}, 2000);

export {};