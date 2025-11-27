-- Delete all FAILED post logs from today to reset the daily limit counter
-- Run this in your database client or use Prisma Studio

DELETE FROM PostLog 
WHERE status = 'FAILED' 
AND date(postedAt) = date('now');

-- Or delete ALL post logs from today (use with caution):
-- DELETE FROM PostLog WHERE date(postedAt) = date('now');
