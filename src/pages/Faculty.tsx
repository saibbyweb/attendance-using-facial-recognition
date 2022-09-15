import ProfileSwitch from "@/components/ProfileSwitch";
import { fetchRemoteData } from "@/helpers/api";
import { useEffect, useState } from "react";

/* profile option type */
export type ProfileOption = {
  label: string,
  value: string
}

export default function Faculty() {
  // fetch faculty list
  // done: there should be an option to switch profile
  // change in profile should refetch data
  // a list of classes should be fetched on being mounted
  // a click on the class id should fetch the list of students for the class
  // there should be some action buttons, one of taking attendance, one for viewing attendance
  // a date selector component might also be needed

  // take attendance button will show a modal to upload an image
  // image is then processed by the face api and *THE MAGIC HAPPENS*
  // the list of all students will popup with those being present having a check mark
  // checkboxes can be manually be marked or unmarked
  // then a button can finalize the attendace and sent it to server to update the database
  // a success message and failure message component may also be needed

  // show attedance modal will populate the list of students in a table with the attendance details (total classes, classes attended, attendance %, shortage)

  // SIDE_NOTE: student list in the admin panel should have an option to upload an image

  /* state */
  // name

  const [profileOptions, setProfileOptions] = useState<ProfileOption[]>([{ label: "one", value: "one"}]);
  const [activeProfile, setActiveProfile] = useState<ProfileOption>(profileOptions[0]);
  
  /* fetch classes data for a single teacher */
  async function setFacultyMemberDetails() {
    let { data } = await fetchRemoteData("faculty", { employeeId: activeProfile.value });
    // setActiveProfile()

  }
  useEffect(() => {
     
  },[])
  
  /* update active profile */
  function updateActiveProfile(option: any) {
    setActiveProfile(option.label);
  }

  return (
    <>
      <div style={{ marginTop: "7vh" }}>
        <ProfileSwitch options={profileOptions} updateActiveProfile={updateActiveProfile} activeProfile={activeProfile} />
      </div>
    </>
  );
}
