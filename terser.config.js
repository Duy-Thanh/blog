module.exports = {
    compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        passes: 3,
        unsafe: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        dead_code: true,
        evaluate: true,
        keep_fargs: false,
        toplevel: true,
        unused: true
    },
    mangle: {
        eval: true,
        toplevel: true,
        safari10: true,
        properties: {
            regex: /^_/
        }
    },
    output: {
        comments: false,
        ascii_only: true
    }
}; 