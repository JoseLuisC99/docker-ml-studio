export interface DockerCommand {
    commands: string[]
    dialogMsg: string
    optDialogMsg: string
    errorMsg: string
}

export function runSequential(commands: DockerCommand[]) {
    //
}