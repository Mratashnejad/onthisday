"use client";

import { FormEvent, useState } from "react";
import {
  AdminCreatePersonDocument,
  AdminDeletePersonDocument,
  AdminUpdatePersonDocument,
  Gender,
  PersonalStatus,
} from "@/gql/graphql";
import { executeGraphql } from "@/lib/graphql-client";
import { parseIdCsv, toDateInputValue } from "@/components/admin/helpers";
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

export default function AdminPersonsPage() {
  const { dashboard, loading, error, message, runMutation, setError } =
    useAdminDashboard();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [title, setTitle] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [deathDate, setDeathDate] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.Male);
  const [status, setStatus] = useState<PersonalStatus>(PersonalStatus.Active);
  const [slug, setSlug] = useState("");
  const [biography, setBiography] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [sportIds, setSportIds] = useState("");
  const [teamIds, setTeamIds] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editNationality, setEditNationality] = useState("");
  const [editBirthDate, setEditBirthDate] = useState("1990-01-01");
  const [editDeathDate, setEditDeathDate] = useState("");
  const [editGender, setEditGender] = useState<Gender>(Gender.Male);
  const [editStatus, setEditStatus] = useState<PersonalStatus>(PersonalStatus.Active);
  const [editSlug, setEditSlug] = useState("");
  const [editBiography, setEditBiography] = useState("");
  const [editProfileImageUrl, setEditProfileImageUrl] = useState("");
  const [editSportIds, setEditSportIds] = useState("");
  const [editTeamIds, setEditTeamIds] = useState("");

  const persons = dashboard?.adminPersons ?? [];

  function validateDate(value: string, label: string): Date | null {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      setError(`${label} is invalid.`);
      return null;
    }

    return date;
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedBirthDate = validateDate(birthDate, "Birth date");
    if (!parsedBirthDate) {
      return;
    }

    const parsedDeathDate = deathDate ? validateDate(deathDate, "Death date") : null;
    if (deathDate && !parsedDeathDate) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminCreatePersonDocument,
          {
            firstname,
            birthDate: parsedBirthDate.toISOString(),
            gender,
            status,
            slug: slug || null,
            lastname: lastname || null,
            title: title || null,
            nationality: nationality || null,
            deathDate: parsedDeathDate ? parsedDeathDate.toISOString() : null,
            biography: biography || null,
            profileImageUrl: profileImageUrl || null,
            sportIds: sportIds.trim() ? parseIdCsv(sportIds) : [],
            teamIds: teamIds.trim() ? parseIdCsv(teamIds) : [],
          },
          { accessToken },
        );

        setFirstname("");
        setLastname("");
        setTitle("");
        setNationality("");
        setBirthDate("1990-01-01");
        setDeathDate("");
        setSlug("");
        setBiography("");
        setProfileImageUrl("");
        setSportIds("");
        setTeamIds("");
      },
      "Person created successfully.",
    );
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    const parsedBirthDate = validateDate(editBirthDate, "Birth date");
    if (!parsedBirthDate) {
      return;
    }

    const parsedDeathDate = editDeathDate
      ? validateDate(editDeathDate, "Death date")
      : null;
    if (editDeathDate && !parsedDeathDate) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        await executeGraphql(
          AdminUpdatePersonDocument,
          {
            id: editingId,
            firstname: editFirstname,
            birthDate: parsedBirthDate.toISOString(),
            gender: editGender,
            status: editStatus,
            slug: editSlug || null,
            lastname: editLastname || null,
            title: editTitle || null,
            nationality: editNationality || null,
            deathDate: parsedDeathDate ? parsedDeathDate.toISOString() : null,
            biography: editBiography || null,
            profileImageUrl: editProfileImageUrl || null,
            sportIds: editSportIds.trim() ? parseIdCsv(editSportIds) : [],
            teamIds: editTeamIds.trim() ? parseIdCsv(editTeamIds) : [],
          },
          { accessToken },
        );

        setEditingId(null);
      },
      "Person updated successfully.",
    );
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this person?")) {
      return;
    }

    await runMutation(
      async (accessToken) => {
        const result = await executeGraphql(
          AdminDeletePersonDocument,
          { id },
          { accessToken },
        );

        if (!result.deletePerson) {
          throw new Error("Person was not found.");
        }
      },
      "Person deleted successfully.",
    );
  }

  function startEdit(item: (typeof persons)[number]) {
    setEditingId(item.id);
    setEditFirstname(item.firstname);
    setEditLastname(item.lastname ?? "");
    setEditTitle(item.title ?? "");
    setEditNationality(item.nationality ?? "");
    setEditBirthDate(toDateInputValue(item.birthDate));
    setEditDeathDate(toDateInputValue(item.deathDate));
    setEditGender(item.gender);
    setEditStatus(item.status);
    setEditSlug(item.slug);
    setEditBiography(item.biography ?? "");
    setEditProfileImageUrl(item.profileImageUrl ?? "");
    setEditSportIds(item.sports.map((sport) => sport.id).join(","));
    setEditTeamIds(item.teams.map((team) => team.id).join(","));
  }

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader title="مدیریت اشخاص" description="CRUD کامل اشخاص" />
      <AdminFeedback message={message} error={error} />

      <AdminCard title="ایجاد شخص جدید">
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
          <input
            value={firstname}
            onChange={(event) => setFirstname(event.target.value)}
            className={inputClass}
            placeholder="Firstname"
            required
          />
          <input
            value={lastname}
            onChange={(event) => setLastname(event.target.value)}
            className={inputClass}
            placeholder="Lastname"
          />
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={inputClass}
            placeholder="Title"
          />
          <input
            value={nationality}
            onChange={(event) => setNationality(event.target.value)}
            className={inputClass}
            placeholder="Nationality"
          />
          <input
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
            className={inputClass}
            required
          />
          <input
            type="date"
            value={deathDate}
            onChange={(event) => setDeathDate(event.target.value)}
            className={inputClass}
          />
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value as Gender)}
            className={inputClass}
          >
            {Object.values(Gender).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as PersonalStatus)}
            className={inputClass}
          >
            {Object.values(PersonalStatus).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className={inputClass}
            placeholder="Slug"
          />
          <input
            value={profileImageUrl}
            onChange={(event) => setProfileImageUrl(event.target.value)}
            className={inputClass}
            placeholder="Profile image URL"
          />
          <input
            value={sportIds}
            onChange={(event) => setSportIds(event.target.value)}
            className={inputClass}
            placeholder="Sport IDs CSV"
          />
          <input
            value={teamIds}
            onChange={(event) => setTeamIds(event.target.value)}
            className={inputClass}
            placeholder="Team IDs CSV"
          />
          <textarea
            value={biography}
            onChange={(event) => setBiography(event.target.value)}
            className={`${textareaClass} md:col-span-2`}
            placeholder="Biography"
          />
          <button type="submit" className={`${primaryButtonClass} md:col-span-2`}>
            Create Person
          </button>
        </form>
      </AdminCard>

      <AdminCard title="لیست اشخاص">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className={tableHeaderClass}>ID</th>
                <th className={tableHeaderClass}>Name</th>
                <th className={tableHeaderClass}>Birth date</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Slug</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="border-b align-top">
                    <td className={tableCellClass}>{item.id}</td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            value={editFirstname}
                            onChange={(event) => setEditFirstname(event.target.value)}
                            className={inputClass}
                          />
                          <input
                            value={editLastname}
                            onChange={(event) => setEditLastname(event.target.value)}
                            className={inputClass}
                            placeholder="Lastname"
                          />
                          <input
                            value={editTitle}
                            onChange={(event) => setEditTitle(event.target.value)}
                            className={inputClass}
                            placeholder="Title"
                          />
                          <input
                            value={editNationality}
                            onChange={(event) => setEditNationality(event.target.value)}
                            className={inputClass}
                            placeholder="Nationality"
                          />
                        </div>
                      ) : (
                        `${item.firstname} ${item.lastname ?? ""}`.trim()
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="date"
                            value={editBirthDate}
                            onChange={(event) => setEditBirthDate(event.target.value)}
                            className={inputClass}
                          />
                          <input
                            type="date"
                            value={editDeathDate}
                            onChange={(event) => setEditDeathDate(event.target.value)}
                            className={inputClass}
                          />
                        </div>
                      ) : (
                        toDateInputValue(item.birthDate)
                      )}
                    </td>
                    <td className={tableCellClass}>
                      {isEditing ? (
                        <div className="space-y-2">
                          <select
                            value={editGender}
                            onChange={(event) => setEditGender(event.target.value as Gender)}
                            className={inputClass}
                          >
                            {Object.values(Gender).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                          <select
                            value={editStatus}
                            onChange={(event) =>
                              setEditStatus(event.target.value as PersonalStatus)
                            }
                            className={inputClass}
                          >
                            {Object.values(PersonalStatus).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <>
                          <p>{item.gender}</p>
                          <p className="text-xs text-gray-500">{item.status}</p>
                        </>
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
                            value={editProfileImageUrl}
                            onChange={(event) => setEditProfileImageUrl(event.target.value)}
                            className={inputClass}
                            placeholder="Profile image URL"
                          />
                          <input
                            value={editSportIds}
                            onChange={(event) => setEditSportIds(event.target.value)}
                            className={inputClass}
                            placeholder="Sport IDs CSV"
                          />
                          <input
                            value={editTeamIds}
                            onChange={(event) => setEditTeamIds(event.target.value)}
                            className={inputClass}
                            placeholder="Team IDs CSV"
                          />
                          <textarea
                            value={editBiography}
                            onChange={(event) => setEditBiography(event.target.value)}
                            className={textareaClass}
                            placeholder="Biography"
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
