import React, { useEffect, useMemo, useState } from "react";
import { contentService } from "../services/contentService";

const emptyService = {
  title: "",
  description: "",
  icon: "",
  sortOrder: 0,
  featured: false,
};
const emptyTestimonial = { name: "", role: "", quote: "", approved: false };
const emptyFaq = { question: "", answer: "", sortOrder: 0 };
const emptyTeamMember = {
  name: "",
  position: "",
  bio: "",
  photoUrl: "",
  socialLinks: {},
};

export default function ContentStudio() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [faqItems, setFaqItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");
  const [form, setForm] = useState(emptyService);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);
  const [faqForm, setFaqForm] = useState(emptyFaq);
  const [teamForm, setTeamForm] = useState(emptyTeamMember);
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    caption: "",
    imageUrl: "",
  });

  const tabs = useMemo(
    () => [
      { id: "services", label: "Services" },
      { id: "testimonials", label: "Testimonials" },
      { id: "team", label: "Team" },
      { id: "faq", label: "FAQs" },
      { id: "gallery", label: "Gallery" },
    ],
    [],
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [serviceData, testimonialData, teamData, faqData, galleryData] =
        await Promise.all([
          contentService.getServices(),
          contentService.getTestimonials(),
          contentService.getTeamMembers(),
          contentService.getFaqItems(),
          contentService.getGalleryItems(),
        ]);
      setServices(serviceData);
      setTestimonials(testimonialData);
      setTeamMembers(teamData);
      setFaqItems(faqData);
      setGalleryItems(galleryData);
    } catch (error) {
      console.error("Failed to load content studio data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateService = async (event) => {
    event.preventDefault();
    try {
      await contentService.createService(form);
      setForm(emptyService);
      loadData();
    } catch (error) {
      console.error("Failed to save service", error);
      alert("Failed to save service");
    }
  };

  const handleDeleteService = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await contentService.deleteService(id);
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (error) {
      console.error("Failed to delete service", error);
      alert("Failed to delete service");
    }
  };

  const handleCreateTestimonial = async (event) => {
    event.preventDefault();
    try {
      await contentService.createTestimonial(testimonialForm);
      setTestimonialForm(emptyTestimonial);
      loadData();
    } catch (error) {
      console.error("Failed to save testimonial", error);
      alert("Failed to save testimonial");
    }
  };

  const handleCreateFaq = async (event) => {
    event.preventDefault();
    try {
      await contentService.createFaqItem(faqForm);
      setFaqForm(emptyFaq);
      loadData();
    } catch (error) {
      console.error("Failed to save FAQ item", error);
      alert("Failed to save FAQ item");
    }
  };

  const handleCreateTeamMember = async (event) => {
    event.preventDefault();
    try {
      await contentService.createTeamMember(teamForm);
      setTeamForm(emptyTeamMember);
      loadData();
    } catch (error) {
      console.error("Failed to save team member", error);
      alert("Failed to save team member");
    }
  };

  const handleGallerySubmit = async (event) => {
    event.preventDefault();
    try {
      await contentService.createGalleryItem(galleryForm);
      setGalleryForm({ title: "", caption: "", imageUrl: "" });
      loadData();
    } catch (error) {
      console.error("Failed to save gallery item", error);
      alert("Failed to save gallery item");
    }
  };

  const renderServices = () => (
    <div className="space-y-4">
      <form
        onSubmit={handleCreateService}
        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
      >
        <h3 className="text-sm font-semibold text-white">Add new service</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Service title"
            className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
          />
          <input
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            placeholder="Icon slug"
            className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description"
            className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
          />
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: Number(e.target.value) })
            }
            placeholder="Sort order"
            className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
        </div>
        <button className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold">
          Save service
        </button>
      </form>
      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{service.title}</p>
                <p className="text-slate-400">{service.description}</p>
              </div>
              <div className="flex w-full sm:w-auto shrink-0 items-center justify-between sm:justify-end gap-3">
                <span className="text-xs text-slate-500">
                  Order {service.sortOrder}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteService(service.id, service.title)}
                  className="text-slate-500 hover:text-red-400 font-medium text-xs px-2 py-1 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-4">
      <form
        onSubmit={handleCreateTestimonial}
        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
      >
        <h3 className="text-sm font-semibold text-white">Add testimonial</h3>
        <input
          value={testimonialForm.name}
          onChange={(e) =>
            setTestimonialForm({ ...testimonialForm, name: e.target.value })
          }
          placeholder="Client name"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <input
          value={testimonialForm.role}
          onChange={(e) =>
            setTestimonialForm({ ...testimonialForm, role: e.target.value })
          }
          placeholder="Role / company"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <textarea
          value={testimonialForm.quote}
          onChange={(e) =>
            setTestimonialForm({ ...testimonialForm, quote: e.target.value })
          }
          placeholder="Quote"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={testimonialForm.approved}
            onChange={(e) =>
              setTestimonialForm({
                ...testimonialForm,
                approved: e.target.checked,
              })
            }
          />
          Approve immediately
        </label>
        <button className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold">
          Save testimonial
        </button>
      </form>
      <div className="space-y-2">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-300"
          >
            <p className="text-white font-semibold">“{testimonial.quote}”</p>
            <p className="text-slate-400 mt-1">
              {testimonial.name} · {testimonial.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-4">
      <form
        onSubmit={handleCreateTeamMember}
        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
      >
        <h3 className="text-sm font-semibold text-white">Add team member</h3>
        <input
          value={teamForm.name}
          onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
          placeholder="Name"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <input
          value={teamForm.position}
          onChange={(e) =>
            setTeamForm({ ...teamForm, position: e.target.value })
          }
          placeholder="Position"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <textarea
          value={teamForm.bio}
          onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
          placeholder="Bio"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <input
          value={teamForm.photoUrl}
          onChange={(e) =>
            setTeamForm({ ...teamForm, photoUrl: e.target.value })
          }
          placeholder="Photo URL"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <button className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold">
          Save member
        </button>
      </form>
      <div className="space-y-2">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-300"
          >
            <p className="font-semibold text-white">{member.name}</p>
            <p className="text-slate-400">{member.position}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFaq = () => (
    <div className="space-y-4">
      <form
        onSubmit={handleCreateFaq}
        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
      >
        <h3 className="text-sm font-semibold text-white">Add FAQ entry</h3>
        <input
          value={faqForm.question}
          onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
          placeholder="Question"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <textarea
          value={faqForm.answer}
          onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
          placeholder="Answer"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <input
          type="number"
          value={faqForm.sortOrder}
          onChange={(e) =>
            setFaqForm({ ...faqForm, sortOrder: Number(e.target.value) })
          }
          placeholder="Sort order"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <button className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold">
          Save question
        </button>
      </form>
      <div className="space-y-2">
        {faqItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-300"
          >
            <p className="font-semibold text-white">{item.question}</p>
            <p className="text-slate-400 mt-1">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="space-y-4">
      <form
        onSubmit={handleGallerySubmit}
        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
      >
        <h3 className="text-sm font-semibold text-white">Add gallery image</h3>
        <input
          value={galleryForm.title}
          onChange={(e) =>
            setGalleryForm({ ...galleryForm, title: e.target.value })
          }
          placeholder="Image title"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <input
          value={galleryForm.imageUrl}
          onChange={(e) =>
            setGalleryForm({ ...galleryForm, imageUrl: e.target.value })
          }
          placeholder="Cloudinary image URL"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <textarea
          value={galleryForm.caption}
          onChange={(e) =>
            setGalleryForm({ ...galleryForm, caption: e.target.value })
          }
          placeholder="Caption"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white text-sm"
        />
        <button className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold">
          Save image
        </button>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">{item.title}</p>
              <p className="text-slate-400 mt-1">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Studio</h1>
        <p className="text-slate-400 text-sm">
          Manage services, testimonials, team members, FAQs, and gallery content
          for the public site.
        </p>
      </div>
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-semibold ${activeTab === tab.id ? "bg-slate-800 text-amber-400" : "text-slate-400"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-slate-400">Loading studio data...</div>
      ) : (
        <>
          {activeTab === "services" && renderServices()}
          {activeTab === "testimonials" && renderTestimonials()}
          {activeTab === "team" && renderTeam()}
          {activeTab === "faq" && renderFaq()}
          {activeTab === "gallery" && renderGallery()}
        </>
      )}
    </div>
  );
}
