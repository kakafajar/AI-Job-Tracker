<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id',
        'target_role',
        'location',
        'work_type',
        'job_type',
        'experience_level',
        'expected_salary',
        'skills',
        'bio',
        'cv_path',
    ];

    protected $casts = [
        'skills' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
