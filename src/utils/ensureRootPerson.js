import { Person } from "../models/Person.js";

export const ensureRootPerson = async () => {
  const root = await Person.findOne({ father_id: null }).select("_id");

  if (root) {
    return root;
  }

  const rootName = process.env.ROOT_PERSON_NAME || "الجد الأكبر";
  const created = await Person.create({ name: rootName, father_id: null });
  return created;
};
