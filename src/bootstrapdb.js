#! /usr/bin/env node

require("dotenv-expand").expand(require("dotenv").config());
const db = require("./configs/db");

console.log(
  `This script bootstraps the database tables.
   e.g. node bootstrapdb
  `
);

(async function () {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await createDepartments(client);
    await createRoles(client);
    await createUsers(client);
    await createPosts(client);
    await createComments(client);

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(`bootstrap-error occurred ---> ${e.message}`);
  } finally {
    client.release();
  }
})()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));

async function createDepartments(client) {
  await client.query(
    `create table if not exists departments (
      id serial NOT NULL primary key,
      name varchar(35) UNIQUE NOT NULL,
      created_at TIMESTAMP NOT NULL default now()
    )`
  );
  console.log("created departments table");

  client
    .query("select id from departments limit 1")
    .then((result0) => {
      if (result0.rowCount === 0) {
        return client.query(
          `insert into departments (name)
           values ('maintenance'), ('logistics'), ('engineering')
           returning id`
        );
      }

      return Promise.resolve({});
    })
    .then((result1) => {
      if (result1?.rows) {
        console.log(`inserted ${result1.rowCount} departments`);
      }
    })
    .catch((e) => {
      console.error(`unable to insert deparments --> ${e.message}`);
    });
}

async function createRoles(client) {
  await client.query(
    `create table if not exists roles (
      id serial NOT NULL,
      name varchar(35) UNIQUE NOT NULL,
      created_at TIMESTAMP NOT NULL default now(),
      primary key (id)
    )`
  );
  console.log("created roles table");

  client
    .query("select id from roles limit 1")
    .then((result0) => {
      if (result0.rowCount === 0) {
        return client.query(
          `insert into roles (name)
           values ('technician'), ('delivery specialist'), ('staff'), ('software engineer II')
           returning id`
        );
      }

      return Promise.resolve({});
    })
    .then((result1) => {
      if (result1?.rows) {
        console.log(`inserted ${result1.rowCount} roles`);
      }
    })
    .catch((e) => {
      console.error(`unable to insert roles --> ${e.message}`);
    });
}

async function createUsers(client) {
  await client.query(
    `create table if not exists users (
      id serial NOT NULL primary key,
      first_name varchar(25) NOT NULL,
      last_name varchar(25) NOT NULL,
      email varchar(150) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      gender char(15),
      address text,
      department_id int NOT NULL,
      role_id int NOT NULL,
      created_at TIMESTAMP NOT NULL default now(),
      constraint fk_users_department foreign key (department_id) references departments (id),
      constraint fk_users_role foreign key (role_id) references roles (id)
    )`
  );
  console.log("created users table");
}

async function createPosts(client) {
  await client.query(
    `create table if not exists posts (
      id serial NOT NULL primary key,
      title varchar(150) NOT NULL,
      content text,
      image_url varchar(250),
      post_type_id int NOT NULL,
      user_id int NOT NULL,
      created_at TIMESTAMPTZ NOT NULL default now(),
      constraint fk_posts_user foreign key (user_id) references users (id) on delete cascade
    )`
  );
  console.log("created posts table");
}

async function createComments(client) {
  await client.query(
    `create table if not exists comments (
      id serial NOT NULL,
      comment varchar(250) NOT NULL,
      post_id int NOT NULL,
      user_id int NOT NULL,
      created_at TIMESTAMPTZ NOT NULL default now(),
      primary key (id),
      constraint fk_comments_post foreign key (post_id) references posts (id) on delete cascade,
      constraint fk_comments_user foreign key (user_id) references users (id) on delete cascade
    )`
  );
  console.log("created comments table");
}
