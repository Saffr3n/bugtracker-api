import MongoStore from 'connect-mongo';

export default () => {
  jest
    .spyOn(MongoStore, 'create')
    .mockReturnValue(undefined as unknown as MongoStore);
};
