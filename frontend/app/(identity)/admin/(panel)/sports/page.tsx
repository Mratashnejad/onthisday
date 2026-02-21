"use client";

import { FormEvent, useState } from "react";
import {
  AdminCreateSportDocument,
  AdminDeleteSportDocument,
  AdminUpdateSportDocument,
  SportType,
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

export default function AdminSportsPage() {
  const { dashboard, loading, error, message, runMutation } = useAdminDashboard();

  const [name, setName] = useState("");
  const [type, setType] = useState<SportType>(SportType.Team);
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<SportType>(SportType.Team);
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIconUrl, setEditIconUrl] = useState("");

  const sports = dashboard?.adminSports ?? [];

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminCreateSportDocument,
          {
            name,
            type,
            slug: slug || null,
            description: description || null,
            iconUrl: iconUrl || null,
          },
          { accessToken },
        );

        setName("");
        setSlug("");
        setDescription("");
        setIconUrl("");
      },
      "Sport created successfully.",
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
          AdminUpdateSportDocument,
          {
            id: editingId,
            name: editName,
            type: editType,
            slug: editSlug || null,
            description: editDescription || null,
            iconUrl: editIconUrl || null,
          },
          { accessToken },
        );

        setEditingId(null);
      },
      "Sport updated successfully.",
    );
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this sport?")) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        const result = await executeGraphql(
          AdminDeleteSportDocument,
          { id },
          { accessToken },
        );

        if (!result.deleteSport) {
          throw new Error("Sport was not found.");
        }
      },
      "Sport deleted successfully.",
    );
  }

  function startEdit(item: (typeof sports)[number]) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditType(item.type);
    setEditSlug(item.slug);
    setEditDescription(item.description ?? "");
    setEditIconUrl(item.iconUrl ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="مدیریت ورزش‌ها"
        description="ثبت، ویرایش و حذف ورزش‌ها"
      />
      <AdminFeedback message={message} error={error} />

      <AdminCard title="ایجاد ورزش جدید">
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="Name"
            required
          />
          <select
            value={type}
            onChange={(event) => setType(event.target.value as SportType)}
            className={inputClass}
          >
            {Object.values(SportType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className={inputClass}
            placeholder="Slug (optional)"
          />
          <input
            value={iconUrl}
            onChange={(event) => setIconUrl(event.target.value)}
            className={inputClass}
            placeholder="Icon URL (optional)"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={`${textareaClass} md:col-span-2`}
            placeholder="Description (optional)"
          />
          <button type="submit" className={`${primaryButtonClass} md:col-span-2`}>
            Create Sport
          </button>
        </form>
      </AdminCard>

      <AdminCard title="لیست ورزش‌ها">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className={tableHeaderClass}>ID</th>
                <th className={tableHeaderClass}>Name</th>
                <th className={tableHeaderClass}>Type</th>
                <th className={tableHeaderClass}>Slug</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sports.map((item) => {
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
                        <select
                          value={editType}
                          onChange={(event) => setEditType(event.target.value as SportType)}
                          className={inputClass}
                        >
                          {Object.values(SportType).map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.type
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
                          <input
                            value={editIconUrl}
                            onChange={(event) => setEditIconUrl(event.target.value)}
                            className={inputClass}
                            placeholder="Icon URL"
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
                    <td className={`${tableCellClass} min-w-56`}>
                      {isEditing ? (
                        <form onSubmit={handleUpdate} className="flex flex-wrap gap-2">
                          <button type="submit" className={primaryButtonClass}>
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
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
