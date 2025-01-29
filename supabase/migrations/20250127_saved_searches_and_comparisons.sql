-- Enable Row Level Security
alter table properties enable row level security;

-- Create saved searches table
create table if not exists saved_searches (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    filters jsonb not null,
    notification_frequency text check (notification_frequency in ('daily', 'weekly', 'never')),
    last_notification_sent timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create property comparisons table
create table if not exists property_comparisons (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    property_ids uuid[] not null,
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create notifications table
create table if not exists property_notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    saved_search_id uuid references saved_searches(id) on delete cascade,
    property_id uuid references properties(id) on delete cascade,
    type text not null check (type in ('new_property', 'price_change', 'status_change')),
    message text not null,
    read boolean default false,
    created_at timestamp with time zone default now()
);

-- Add RLS policies
alter table saved_searches enable row level security;
alter table property_comparisons enable row level security;
alter table property_notifications enable row level security;

-- RLS policies for saved searches
create policy "Users can view their own saved searches"
    on saved_searches for select
    using (auth.uid() = user_id);

create policy "Users can create their own saved searches"
    on saved_searches for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own saved searches"
    on saved_searches for update
    using (auth.uid() = user_id);

create policy "Users can delete their own saved searches"
    on saved_searches for delete
    using (auth.uid() = user_id);

-- RLS policies for property comparisons
create policy "Users can view their own property comparisons"
    on property_comparisons for select
    using (auth.uid() = user_id);

create policy "Users can create their own property comparisons"
    on property_comparisons for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own property comparisons"
    on property_comparisons for update
    using (auth.uid() = user_id);

create policy "Users can delete their own property comparisons"
    on property_comparisons for delete
    using (auth.uid() = user_id);

-- RLS policies for notifications
create policy "Users can view their own notifications"
    on property_notifications for select
    using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists saved_searches_user_id_idx on saved_searches(user_id);
create index if not exists property_comparisons_user_id_idx on property_comparisons(user_id);
create index if not exists property_notifications_user_id_idx on property_notifications(user_id);
create index if not exists property_notifications_saved_search_id_idx on property_notifications(saved_search_id);
