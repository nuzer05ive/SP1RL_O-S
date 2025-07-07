// MONDAY core-math WASM stub
#[no_mangle]
pub extern "C" fn theta_f32(n: u32, k: u8) -> f32 {
    let lap_size: f32 = 89.0;
    ((n + k as u32) % 89) as f32 / lap_size
}
