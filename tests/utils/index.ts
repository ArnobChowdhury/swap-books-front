import sinon from 'sinon';

export const getFakeResponseAndMocks = (
  spyCreator: sinon.SinonSpyStatic,
  fakeCreator: sinon.SinonFake,
): {
  res: {
    status: sinon.SinonSpy<unknown[], unknown>;
  };
  refToFakeStatusFunc: sinon.SinonSpy<unknown[], unknown>;
  refToSpiedJsonFunc: sinon.SinonSpy<unknown[], unknown>;
} => {
  const spiedJson = spyCreator();
  const fakeStatus = fakeCreator.returns({
    json: spiedJson,
  });
  return {
    res: {
      status: fakeStatus,
    },
    refToFakeStatusFunc: fakeStatus,
    refToSpiedJsonFunc: spiedJson,
  };
};
