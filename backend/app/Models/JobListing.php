<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    protected $fillable = [
        'title',
        'company',
        'location',
        'work_type',
        'job_type',
        'salary_range',
        'description',
        'requirements',
        'source',
        'source_url',
        'posted_date',
    ];

    protected $casts = [
        'requirements' => 'array',
    ];

    public function trackedJobs()
    {
        return $this->hasMany(TrackedJob::class);
    }
}
