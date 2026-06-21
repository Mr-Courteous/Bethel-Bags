import CourseForm from "@/components/admin/CourseForm";
export default function NewCoursePage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-empire-black mb-2">Add Course</h1>
      <p className="text-empire-grey text-sm mb-8">Create a new bag-making training course.</p>
      <CourseForm />
    </div>
  );
}
