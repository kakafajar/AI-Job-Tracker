<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackedJob extends Model
{
    protected $fillable = [
        'user_id',
        'job_listing_id',
        'title',
        'company',
        'location',
        'work_type',
        'job_type',
        'salary_range',
        'status',
        'match_score',
        'match_reason',
        'matched_skills',
        'source',
        'source_url',
        'posted_date',
        'notes',
    ];

    protected $casts = [
        'matched_skills' => 'array',
        'match_score' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobListing()
    {
        return $this->belongsTo(JobListing::class);
    }
}
