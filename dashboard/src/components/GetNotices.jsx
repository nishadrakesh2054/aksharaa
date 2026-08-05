import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getImageUrl from "../utils/imageUrl";
import { listFromResponse } from "../utils/apiResponse";

const GetNotices = () => {
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/notice/getallnotice`
      );

      if (response.data.success) {
        setData(listFromResponse(response.data, ["notices"]));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/notice/deletenotice/${id}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setData((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setSelectedFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a new image file to update.");
      return;
    }

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("Noticeimage", selectedFile);

      const response = await axios.put(
        `${import.meta.env.VITE_SERVERAPI}/api/v1/notice/updatenotice/${editingItem._id}`,
        formData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingItem(null);
        setSelectedFile(null);
        fetchData();
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
              All Notices
            </span>
          </h3>

          <div className="container mx-auto">
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark border border-danger">
                  <tr>
                    <th className="text-center">Image</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="border border-info">
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        <img
                          src={getImageUrl(item.images)}
                          alt="Notice"
                          width="100"
                          className="img-fluid rounded"
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-warning btn-md text-dark mx-1"
                          onClick={() => handleEdit(item)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>

                        <button
                          className="btn btn-danger btn-md mx-1"
                          onClick={() => handleDelete(item._id)}
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
                  <h5 className="modal-title">Edit Notice</h5>
                  <button type="button" className="btn-close" onClick={() => setEditingItem(null)}></button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="modal-body">
                    <div className="mb-3 text-center">
                      <p className="fw-bold">Current Image:</p>
                      <img
                        src={getImageUrl(editingItem?.images)}
                        alt="Current Notice"
                        className="img-fluid rounded"
                        style={{ maxHeight: "150px" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Select New Notice Image:</label>
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

export default GetNotices;
