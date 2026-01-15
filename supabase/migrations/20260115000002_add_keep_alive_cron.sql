-- Enable the pg_cron extension if it's not already enabled
create extension if not exists pg_cron;

-- Schedule a keep-alive job to run every 15 minutes
-- This helps prevent the database from pausing due to inactivity
select cron.schedule(
  'keep-alive-job',
  '*/15 * * * *',
  'select 1'
);

-- Optional: List all scheduled jobs to verify
-- select * from cron.job;
