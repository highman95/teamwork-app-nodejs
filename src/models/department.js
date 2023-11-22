exports.fetchAll = async () => {
  // eslint-disable-next-line no-undef
  const results = await db.query(
    'SELECT id, name FROM departments ORDER BY name'
  );
  return results.rows;
};

exports.findByName = async (name) => {
  if (!name?.trim()) throw new Error('Department cannot be empty'); // 400

  // eslint-disable-next-line no-undef
  const result = await db.query(
    'SELECT id, name FROM departments WHERE LOWER(name) = $1',
    [name.toLowerCase()]
  );
  return result.rows[0] || {};
};
