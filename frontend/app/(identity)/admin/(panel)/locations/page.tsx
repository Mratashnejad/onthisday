"use client";

import { FormEvent, useState } from "react";
import {
  AdminCreateLocationDocument,
  AdminDeleteLocationDocument,
  AdminUpdateLocationDocument,
} from "@/gql/graphql";
import { executeGraphql } from "@/lib/graphql-client";
import { useAdminDashboard } from "@/components/admin/useAdminDashboard";
import {
  AdminCard,
  AdminFeedback,
  AdminLoading,
  AdminPageHeader,
  dangerButtonClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  tableCellClass,
  tableHeaderClass,
  textareaClass,
} from "@/components/admin/ui";

export default function AdminLocationsPage() {
  const { dashboard, loading, error, message, runMutation } = useAdminDashboard();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const locations = dashboard?.adminLocations ?? [];

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminCreateLocationDocument,
          {
            name,
            slug: slug || null,
            city: city || null,
            country: country || null,
            description: description || null,
          },
          { accessToken },
        );

        setName("");
        setSlug("");
        setCity("");
        setCountry("");
        setDescription("");
      },
      "Location created successfully.",
    );
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminUpdateLocationDocument,
          {
            id: editingId,
            name: editName,
            slug: editSlug || null,
            city: editCity || null,
            country: editCountry || null,
            description: editDescription || null,
          },
          { accessToken },
        );

        setEditingId(null);
      },
      "Location updated successfully.",
    );
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this location?")) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        const result = await executeGraphql(
          AdminDeleteLocationDocument,
          { id },
          { accessToken },
        );

        if (!result.deleteLocation) {
          throw new Error("Location was not found.");
        }
      },
      "Location deleted successfully.",
    );
  }

  function startEdit(item: (typeof locations)[number]) {
    setEditingId(item.id);
    setEditName(item.name ?? "");
    setEditSlug(item.slug);
    setEditCity(item.city ?? "");
    setEditCountry(item.country ?? "");
    setEditDescription(item.description ?? "");
  }

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader title="مدیریت مکان‌ها" description="CRUD کامل مکان‌ها" />
      <AdminFeedback message={message} error={error} />

      <AdminCard title="ایجاد مکان جدید">
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="Name"
            required
          />
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className={inputClass}
            placeholder="Slug (optional)"
          />
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className={inputClass}
            placeholder="City"
          />
          <input
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className={inputClass}
            placeholder="Country"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={`${textareaClass} md:col-span-2`}
            placeholder="Description"
          />
          <button type="submit" className={`${primaryButtonClass} md:col-span-2`}>
            Create Location
          </button>
        </form>
      </AdminCard>

      <AdminCard title="لیست مکان‌ها">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className={tableHeaderClass}>ID</th>
                <th className={tableHeaderClass}>Name</th>
                <th className={tableHeaderClass}>City / Country</th>
                <th className={tableHeaderClass}>Slug</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="border-b align-top">
                    <td className={tableCellClass}>{item.id}</td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <input
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          className={inputClass}
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            value={editCity}
                            onChange={(event) => setEditCity(event.target.value)}
                            className={inputClass}
                            placeholder="City"
                          />
                          <input
                            value={editCountry}
                            onChange={(event) => setEditCountry(event.target.value)}
                            className={inputClass}
                            placeholder="Country"
                          />
                        </div>
                      ) : (
                        `${item.city ?? "-"} / ${item.country ?? "-"}`
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            value={editSlug}
                            onChange={(event) => setEditSlug(event.target.value)}
                            className={inputClass}
                            placeholder="Slug"
                          />
                          <textarea
                            value={editDescription}
                            onChange={(event) => setEditDescription(event.target.value)}
                            className={textareaClass}
                            placeholder="Description"
                          />
                        </div>
                      ) : (
                        item.slug
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <form onSubmit={handleUpdate} className="flex flex-wrap gap-2">
                          <button type="submit" className={primaryButtonClass}>
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className={secondaryButtonClass}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className={secondaryButtonClass}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className={dangerButtonClass}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </section>
  );
}
