import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import {
  Button,
  GameSheet,
  Gradient,
  Icon,
  NavBar,
  Pressable,
  Screen,
  SectionHeader,
  Star,
  Text,
  type IconName,
} from "@/components";
import { img } from "@/data/images";
import { findFan, relOf, setRel, threads, useSocial } from "@/data/social";
import { CatChip, FanAvatar } from "@/features/social/parts";
import { colors, shadows } from "@/theme";

const badges: [IconName, string, string, string][] = [
  ["champion", "Чемпион 2026", "#FFF1D6", "#9A6200"],
  ["fire", "Фан-сектор 30+", "#FDE6E7", "#C8040F"],
  ["football", "Прогнозист", colors.blue10, colors.blue600],
  ["star-award-01", "Знаток клуба", "#E3F6EC", "#14804A"],
];
const glass = {
  backgroundColor: "rgba(255,255,255,0.14)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.24)",
};

function HeroBtn({
  label,
  icon,
  onPress,
  kind,
}: {
  label: string;
  icon: IconName;
  onPress?: () => void;
  kind: "white" | "glass" | "lock";
}) {
  const fg =
    kind === "white"
      ? colors.navy
      : kind === "glass"
        ? colors.surface
        : "rgba(255,255,255,0.6)";
  return (
    <Pressable
      accessibilityRole="button"
      disabled={kind === "lock"}
      onPress={onPress}
      style={[
        {
          flex: 1,
          height: 46,
          paddingHorizontal: 10,
          borderRadius: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        },
        kind === "white"
          ? { backgroundColor: colors.surface }
          : kind === "glass"
            ? glass
            : {
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: "rgba(255,255,255,0.3)",
              },
      ]}
    >
      <Icon name={icon} size={18} color={fg} weight={2} />
      <Text size={15} weight={700} color={fg} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Профиль болельщика: добавить в друзья, принять заявку, написать. */
export default function FanProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = useSocial();
  const f = findFan(id);
  const [menu, setMenu] = useState(false);
  if (!f) return <Screen header={<NavBar title="Болельщик" />}>{null}</Screen>;
  const rel = relOf(s, f.id);
  const first = f.name.split(" ")[0];
  const posts = threads.filter((t) => t.author === f.id).slice(0, 2);
  const mutual = ["tim", "erl", "sab"]
    .filter((x) => x !== f.id)
    .slice(0, Math.min(3, f.mutual));

  return (
    <Screen
      gap={16}
      header={
        <NavBar
          title="Болельщик"
          action={
            rel === "friend"
              ? {
                  icon: "more-horizontal",
                  label: "Ещё",
                  onPress: () => setMenu(true),
                }
              : undefined
          }
        />
      }
      decor={
        <Star w={80} fill={colors.star} style={{ top: 760, right: -20 }} />
      }
    >
      <View
        style={{
          marginHorizontal: 20,
          borderRadius: 24,
          overflow: "hidden",
          ...shadows.card,
        }}
      >
        <Gradient
          colors={[colors.navy, "#0B5E92", colors.blue]}
          style={{
            paddingTop: 24,
            paddingHorizontal: 16,
            paddingBottom: 18,
            alignItems: "center",
            gap: 8,
          }}
        >
          <Star w={16} fill="#FFFFFF" style={{ left: 70, top: 28 }} />
          <Star w={12} fill={colors.sky} style={{ right: 64, top: 52 }} />
          <View
            style={{
              padding: 3,
              borderRadius: 50,
              backgroundColor: colors.surface,
            }}
          >
            <FanAvatar id={f.id} size={90} />
          </View>
          <Text
            display
            size={30}
            upper
            color="surface"
            align="center"
            style={{ marginTop: 4 }}
          >
            {f.name}
          </Text>
          <Text size={14} color="onDark2">
            ORDA ID {f.ordaId} · болеет с {f.since}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <View
              style={[
                {
                  height: 26,
                  paddingHorizontal: 10,
                  borderRadius: 13,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                },
                glass,
              ]}
            >
              <Icon name="location-01" size={14} color="surface" weight={2} />
              <Text size={13} weight={700} color="surface">
                {f.sector}
              </Text>
            </View>
            <View
              style={{
                height: 26,
                paddingHorizontal: 10,
                borderRadius: 13,
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: f.online
                  ? "rgba(29,180,90,0.22)"
                  : "rgba(255,255,255,0.1)",
              }}
            >
              {f.online ? (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "#3BE07F",
                  }}
                />
              ) : null}
              <Text size={13} weight={700} color="surface">
                {f.online ? "В сети" : f.seen}
              </Text>
            </View>
          </View>
          <View style={{ width: "100%", marginTop: 8, gap: 8 }}>
            {rel === "none" ? (
              <>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <HeroBtn
                    label="Добавить в друзья"
                    icon="user-round-plus"
                    kind="white"
                    onPress={() => setRel(f.id, "sent")}
                  />
                  <HeroBtn label="Написать" icon="square-lock-01" kind="lock" />
                </View>
                <Text size={12} color="#A9C6E3" align="center">
                  Написать можно, когда {first} примет заявку
                </Text>
              </>
            ) : rel === "sent" ? (
              <>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <HeroBtn
                    label="Заявка отправлена"
                    icon="clock-01"
                    kind="glass"
                  />
                  <HeroBtn
                    label="Отменить"
                    icon="cancel-01"
                    kind="glass"
                    onPress={() => setRel(f.id, "none")}
                  />
                </View>
                <Text size={12} color="#A9C6E3" align="center">
                  Пришлём уведомление, когда {first} ответит
                </Text>
              </>
            ) : rel === "incoming" ? (
              <View
                style={{
                  padding: 12,
                  borderRadius: 18,
                  backgroundColor: colors.surface,
                  gap: 10,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Icon name="user-round-plus" size={20} color="blue" />
                  <Text size={15} weight={700} style={{ flex: 1 }}>
                    {first} хочет добавить вас в друзья
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Button
                    label="Принять"
                    icon="user-round-check"
                    height={44}
                    onPress={() => setRel(f.id, "friend")}
                    style={{ flex: 1 }}
                  />
                  <Button
                    label="Отклонить"
                    variant="muted"
                    height={44}
                    onPress={() => setRel(f.id, "none")}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <HeroBtn
                  label="Написать"
                  icon="message-01"
                  kind="white"
                  onPress={() =>
                    router.push({
                      pathname: "/chat/[id]",
                      params: { id: f.id },
                    })
                  }
                />
                <HeroBtn
                  label="В друзьях"
                  icon="user-round-check"
                  kind="glass"
                  onPress={() => setMenu(true)}
                />
              </View>
            )}
          </View>
        </Gradient>
      </View>

      <View
        style={{
          marginHorizontal: 20,
          padding: 12,
          borderRadius: 20,
          backgroundColor: colors.surface,
          flexDirection: "row",
          gap: 8,
          ...shadows.card,
        }}
      >
        {[
          [f.points, "баллов", "coin"],
          [String(f.level), "уровень", "star-award-01"],
          [String(f.matches), "матчей на стадионе", "ticket-01"],
        ].map(([v, l, ic]) => (
          <View
            key={l}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 6,
              borderRadius: 16,
              backgroundColor: colors.bg,
              alignItems: "center",
              gap: 4,
            }}
          >
            {ic === "coin" ? (
              <Image
                source={img.coin}
                style={{ width: 26, height: 26 }}
                contentFit="contain"
              />
            ) : (
              <Icon name={ic as IconName} size={22} color="blue" />
            )}
            <Text display size={24}>
              {v}
            </Text>
            <Text size={12} color="text2" align="center">
              {l}
            </Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Достижения" />
      <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 20 }}>
        {badges.map(([ic, t, bg, fg]) => (
          <View
            key={t}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 4,
              borderRadius: 18,
              backgroundColor: colors.surface,
              alignItems: "center",
              gap: 6,
              ...shadows.card,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: bg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={ic} size={22} color={fg} weight={1.8} />
            </View>
            <Text size={12} weight={700} align="center" lineHeight={15}>
              {t}
            </Text>
          </View>
        ))}
      </View>

      {mutual.length ? (
        <SectionHeader title={`Общие друзья · ${mutual.length}`} />
      ) : null}
      {mutual.length ? (
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push("/friends")}
          style={{
            marginHorizontal: 20,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 20,
            backgroundColor: colors.surface,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            ...shadows.card,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {mutual.map((m, i) => (
              <View
                key={m}
                style={{
                  marginLeft: i ? -10 : 0,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: colors.surface,
                }}
              >
                <FanAvatar id={m} size={36} online={false} />
              </View>
            ))}
          </View>
          <Text size={15} style={{ flex: 1 }}>
            {mutual.map((m) => findFan(m)?.name.split(" ")[0]).join(", ")}
          </Text>
          <Icon name="arrow-right-01" size={20} color="text3" />
        </Pressable>
      ) : null}

      {posts.length ? (
        <>
          <SectionHeader
            title="На форуме"
            link="Все темы"
            onPress={() => router.push("/forum")}
          />
          {posts.map((t) => (
            <Pressable
              key={t.id}
              accessibilityRole="link"
              onPress={() =>
                router.push({
                  pathname: "/forum/thread/[id]",
                  params: { id: t.id },
                })
              }
              style={{
                marginHorizontal: 20,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 20,
                backgroundColor: colors.surface,
                gap: 6,
                ...shadows.card,
              }}
            >
              <CatChip cat={t.cat} />
              <Text size={16} weight={700} lineHeight={21}>
                {t.title}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Icon name="bubble-chat" size={15} color="text2" />
                <Text size={13} color="text2">
                  {t.replies} ответов · {t.time}
                </Text>
              </View>
            </Pressable>
          ))}
        </>
      ) : null}

      <GameSheet
        visible={menu}
        onClose={() => setMenu(false)}
        title={f.name}
        text={`В друзьях · ${f.sector}`}
      >
        <View style={{ borderRadius: 18, backgroundColor: colors.bg }}>
          {(
            [
              [
                "notification-off-01",
                "Не присылать уведомления",
                colors.navy,
                () => setMenu(false),
              ],
              [
                "user-round-x",
                "Удалить из друзей",
                colors.navy,
                () => {
                  setRel(f.id, "none");
                  setMenu(false);
                },
              ],
              ["flag-01", "Пожаловаться", colors.navy, () => setMenu(false)],
              [
                "blocked",
                "Заблокировать",
                colors.errorText,
                () => {
                  setRel(f.id, "none");
                  setMenu(false);
                },
              ],
            ] as [IconName, string, string, () => void][]
          ).map(([ic, t, c, fn], i) => (
            <Pressable
              key={t}
              accessibilityRole="button"
              onPress={fn}
              style={{
                minHeight: 56,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                borderBottomWidth: i === 3 ? 0 : 1,
                borderColor: colors.line,
              }}
            >
              <Icon name={ic} size={22} color={c} />
              <Text size={16} weight={700} color={c}>
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text size={13} lineHeight={18} color="text2">
          {first} не получит уведомления. Переписка сохранится, но писать друг
          другу будет нельзя.
        </Text>
        <Button
          label="Отмена"
          variant="muted"
          height={52}
          onPress={() => setMenu(false)}
        />
      </GameSheet>
    </Screen>
  );
}
