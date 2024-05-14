module.exports = {
  getApps: jest.fn(() => []),
  initializeApp: jest.fn(),
  getApp: jest.fn(),
  getAuth: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn(),
  })),
  getFirestore: jest.fn(() => ({
    collection: jest.fn(),
  })),
  collection: jest.fn(() => ({
    withConverter: jest.fn(),
  })),
};
