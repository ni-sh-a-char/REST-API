package com.course.springrest.services;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;

import com.course.springrest.entities.Course;

public interface CourseService {

		public List<Course> getCourses();
		
		public Course getCourse(long courseId);
		
		public Course addCourse(Course course);
		
	}
