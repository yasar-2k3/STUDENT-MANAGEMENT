import React, { useState } from 'react';
import { Button } from "/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "/components/ui/card";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
  grade: string;
  course: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  notes?: string;
}

const StudentManagementSystem: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      age: 20,
      grade: 'A',
      course: 'Computer Science',
      enrollmentDate: '2023-09-01',
      status: 'active',
      notes: 'Excellent performance in programming courses'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      age: 22,
      grade: 'B+',
      course: 'Engineering',
      enrollmentDate: '2022-08-15',
      status: 'active',
      notes: 'Strong in mathematics and physics'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      age: 21,
      grade: 'A-',
      course: 'Business Administration',
      enrollmentDate: '2023-01-10',
      status: 'inactive',
      notes: 'Currently on academic leave'
    }
  ]);

  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    name: '',
    email: '',
    age: 18,
    grade: 'A',
    course: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'active',
    notes: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setStudents(students.map(student =>
        student.id === editingId ? { ...formData, id: editingId } : student
      ));
      setEditingId(null);
    } else {
      const newStudent: Student = {
        ...formData,
        id: Date.now().toString()
      };
      setStudents([...students, newStudent]);
    }

    setFormData({
      name: '',
      email: '',
      age: 18,
      grade: 'A',
      course: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active',
      notes: ''
    });
    setShowForm(false);
  };

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      email: student.email,
      age: student.age,
      grade: student.grade,
      course: student.course,
      enrollmentDate: student.enrollmentDate,
      status: student.status,
      notes: student.notes || ''
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'graduated': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 font-semibold';
      case 'B': return 'text-blue-600 font-semibold';
      case 'C': return 'text-yellow-600 font-semibold';
      case 'D': return 'text-orange-600 font-semibold';
      case 'F': return 'text-red-600 font-semibold';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              Student Management System
            </CardTitle>
            <CardDescription>
              Manage student records, grades, and enrollment information
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">Search students</Label>
                  <Input
                    id="search"
                    placeholder="Search by name, email, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="whitespace-nowrap"
              >
                {showForm ? 'Cancel' : 'Add New Student'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Student' : 'Add New Student'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min="16"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course/Program *</Label>
                    <Input
                      id="course"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Select
                      value={formData.grade}
                      onValueChange={(value) => setFormData({ ...formData, grade: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: Student['status']) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                    <Input
                      id="enrollmentDate"
                      type="date"
                      value={formData.enrollmentDate}
                      onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingId ? 'Update Student' : 'Add Student'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        name: '',
                        email: '',
                        age: 18,
                        grade: 'A',
                        course: '',
                        enrollmentDate: new Date().toISOString().split('T')[0],
                        status: 'active',
                        notes: ''
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No students found matching your criteria.</p>
                {students.length === 0 && (
                  <p className="mt-2">Get started by adding your first student!</p>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {student.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(student.status)}`}>
                              {student.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-2">{student.email}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span>Age: {student.age}</span>
                            <span>Course: {student.course}</span>
                            <span className={getGradeColor(student.grade)}>
                              Grade: {student.grade}
                            </span>
                            <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                          </div>
                          {student.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              {student.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 lg:flex-col">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(student)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{students.length}</div>
                <div className="text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.status === 'active').length}
                </div>
                <div className="text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center p-4 bg-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {students.filter(s => s.grade === 'A').length}
                </div>
                <div className="text-muted-foreground">A Grade Students</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentManagementSystem;
