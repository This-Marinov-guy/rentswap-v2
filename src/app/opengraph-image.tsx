import { ImageResponse } from "next/og";

export const alt = "RentSwap — Find your next home in the Netherlands";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 76px",
          background: "#f8f7f4",
          color: "#1d3557",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              display: "flex",
              borderRadius: 10,
              background: "#fa3c4c",
            }}
          />
          RentSwap
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              maxWidth: 940,
              display: "flex",
              fontSize: 74,
              lineHeight: 1.04,
              letterSpacing: "-3px",
              fontWeight: 800,
            }}
          >
            Find your next home without the competition.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#52657d",
            }}
          >
            Housing, roommate and local community resources across the Netherlands.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            height: 10,
            borderRadius: 999,
            background: "#fa3c4c",
          }}
        />
      </div>
    ),
    size,
  );
}
