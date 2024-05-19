import del from "del"

const reset = () => {
    return del(app.path.clean)
    // return del([`${app.path.clean}/*`, `${app.path.clean}/js/*`])
}

export { reset }