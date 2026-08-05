import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getImageUrl from "../utils/imageUrl";
import { listFromResponse } from "../utils/apiResponse";

const AllTeacherProfile = () => {
  const [teachers, setTeachers] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/getallprofile`
      );

      setTeachers(listFromResponse(response.data, ["profiles"]));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher profile?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/deleteprofile/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTeachers((prev) => prev.filter((teacher) => teacher._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (teacher) => {
    setEditingItem(teacher);
    setEditTitle(teacher.title || "");
    setEditPosition(teacher.position || "");
    setSelectedFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editPosition.trim()) {
      toast.error("Title and Position are required.");
      return;
    }

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("position", editPosition);
      if (selectedFile) {
        formData.append("profileimage", selectedFile);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/updateprofile/${editingItem._id}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingItem(null);
        setSelectedFile(null);
        fetchTeachers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="pagebox">
        <section className="section min-vh-100 d-flex flex-column align-items-center justify-content-start py-4">
          <h3 className="d-flex justify-content-center pt-5">
            <span className="d-none d-lg-block border-bottom border-danger text-success border-2 fw-semibold">
              All Teacher Profiles
            </span>
          </h3>

          <div className="container mx-auto">
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark border border-danger">
                  <tr>
                    <th className="text-center">Title</th>
                    <th className="text-center">Position</th>
                    <th className="text-center">Image</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="border border-info">
                  {teachers.map((teacher, index) => (
                    <tr key={index}>
                      <td className="text-center">{teacher.title}</td>
                      <td className="text-center">{teacher.position}</td>
                      <td className="text-center">
                        <img
                          src={getImageUrl(teacher.image)}
                          alt={teacher.title}
                          width="100"
                          className="img-fluid rounded"
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-warning btn-md mx-1 text-dark"
                          onClick={() => handleEdit(teacher)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-md mx-1"
                          onClick={() => handleDelete(teacher._id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Edit Modal */}
        {editingItem && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Teacher Profile</h5>
                  <button type="button" className="btn-close" onClick={() => setEditingItem(null)}></button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Full Name / Title:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Position:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editPosition}
                        onChange={(e) => setEditPosition(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Replace Profile Image (Optional):</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={updating}>
                      {updating ? "Updating..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllTeacherProfile;
