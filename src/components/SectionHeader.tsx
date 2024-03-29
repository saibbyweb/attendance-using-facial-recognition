import { theme } from "@/App";
import ProfileSwitch from "@/components/ProfileSwitch";
import { Box, Typography } from "@mui/material";

/* profile option type */
export type ProfileOption = {
    label: string;
    value: string;
  };

/* faculty header props */
type SectionHeaderProps = {
    profileOptions: ProfileOption[];
    activeProfile: ProfileOption;
    updateActiveProfile: Function;
  };

/* faculty header component */
export default function SectionHeader({ profileOptions, activeProfile, updateActiveProfile }: SectionHeaderProps) {
    return (
      <Box
        padding="10px"
        borderRadius="4px"
        sx={{
          display: "flex",
        }}
        justifyContent="space-around"
        bgcolor="white"
      >
        <Typography variant="h5" color={theme.palette.primary.dark} sx={{ width: "50%" }}>
          👋 Hi, {activeProfile.label}
        </Typography>
        <ProfileSwitch options={profileOptions} updateActiveProfile={updateActiveProfile} activeProfile={activeProfile} />
      </Box>
    );
  }
  