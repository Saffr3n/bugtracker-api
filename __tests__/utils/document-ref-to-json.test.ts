import { documentRefToJson } from '../../src/utils';
import User from '../../src/models/user';
import Project from '../../src/models/project';

describe('documentRefToJson utility function', () => {
  const manager = new User({
    username: 'manager',
    email: 'manager@example.com',
    hash: 'hashedPassword',
    role: 'Project Manager'
  });

  const user1 = new User({
    username: 'user_1',
    email: 'user_1@example.com',
    hash: 'hashedPassword'
  });

  const user2 = new User({
    username: 'user_2',
    email: 'user_2@example.com',
    hash: 'hashedPassword'
  });

  it('returns ref id string for non-array fields that are not populated', () => {
    const proj = new Project({ manager: manager.id });
    const json = documentRefToJson(proj.manager);
    expect(json).toBe(manager.id);
  });

  it('returns ref id string array for array fields that are not populated', () => {
    const proj = new Project({ developers: [user1.id, user2.id] });
    const json = documentRefToJson(proj.developers);
    expect(json).toEqual([user1.id, user2.id]);
  });

  it('returns document json for non-array fields that are populated', () => {
    const proj = new Project({ manager: manager.id });
    proj.manager = manager;
    const json = documentRefToJson(proj.manager);
    expect(json).toEqual(manager.toJson());
  });

  it('returns document json array for array fields that are populated', () => {
    const proj = new Project({ developers: [user1.id, user2.id] });
    proj.developers = [user1, user2];
    const json = documentRefToJson(proj.developers);
    expect(json).toEqual([user1.toJson(), user2.toJson()]);
  });
});
