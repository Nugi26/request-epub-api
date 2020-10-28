/* add new foreign key column */
ALTER TABLE users
ADD book_id INTEGER REFERENCES books(id);

/* update TABLE */
UPDATE users
SET book_id = 37
WHERE id = 4;

/* innerJoin: join all records from  2 tables that have foreign keys (FK is not null) */
/* in this case, this shows users table dan diteruskan dengan book table yang menampilkan record dari book id */
SELECT username, title FROM users
JOIN books ON users.book_id = books.id;

/* left join: join table from the left to table on the right even if foreign key is null */
/* simply, innerJoin but include people without book */
SELECT username, title FROM users
LEFT JOIN books ON users.book_id = books.id
ORDER BY title;

SELECT username, title FROM users
LEFT JOIN books ON users.book_id = books.id
where books.title IS NULL;

select books.* from users
left join books on users.book_id = books.id
where users.id = 1;

/* count request_count for a book */
select book_id, count('book_id') from user_request
group by book_id
order by book_id;

/* add requests_count column to books table */
ALTER TABLE books
add column requests_count integer;

/* insert user_request */
insert into user_request (user_id, book_id)
values (66,10);

ALTER TABLE books
ADD requests_count INTEGER; 
/* set requests_count column in books */

with book_totalreqs as (
  select book_id, count('book_id') as totalreqs
  from user_request
  group by book_id
)
update books
set requests_count = (
  select totalreqs from book_totalreqs
  where books.id in (book_totalreqs.book_id)
);
