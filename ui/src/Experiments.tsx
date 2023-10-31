import { Box, Stack, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";

export function Experiments() {
    return (
        <>
        <AnimatedPage>
        <Stack spacing={2}>
            <Box textAlign={'center'}>
            <Typography variant='h2'>Experiments</Typography>
            </Box>
        </Stack>
        </AnimatedPage>
        </>
    )
}