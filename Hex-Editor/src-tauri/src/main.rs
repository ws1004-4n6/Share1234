// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;

#[tauri::command]
fn read_file_as_hex(file_path: String) -> Result<String, String> {
    println!("File path received: {}", file_path);
    match fs::read(file_path) {
        Ok(data) => {
            let hex_string = data
                .chunks(16)
                .map(|chunk| {
                    let hex = chunk
                        .iter()
                        .map(|byte| format!("{:02x}", byte))
                        .collect::<Vec<_>>()
                        .join(" ");
                    let ascii = chunk
                        .iter()
                        .map(|byte| {
                            if byte.is_ascii_graphic() || *byte == b' ' {
                                *byte as char
                            } else {
                                '.'
                            }
                        })
                        .collect::<String>();
                    format!("{:48} | {}", hex, ascii)
                })
                .collect::<Vec<_>>()
                .join("\n");
            Ok(hex_string)
        }
        Err(err) => Err(format!("Failed to read file: {}", err)),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![read_file_as_hex])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
