#!/usr/bin/env bash
set -euo pipefail

# Defaults (all "auto" => random behavior)
RESULT="auto"          # auto|success|fail
DURATION="auto"        # auto|<seconds>|<min>-<max>
PRINT_START="auto"     # auto|yes|no
PRINT_PROGRESS="auto"  # auto|yes|no

usage() {
  cat <<'USG' >&2
Usage: worker.sh [--result auto|success|fail] [--duration auto|N]
               [--print-start auto|yes|no] [--print-progress auto|yes|no]
USG
}

# --- helpers ---
rand_bool() {                     # returns 0 for true, 1 for false
  (( RANDOM % 2 == 0 ))
}
rand_in_range() {                 # args: MIN MAX  -> echo int in [MIN,MAX]
  local min=$1 max=$2
  echo $(( min + RANDOM % (max - min + 1) ))
}
parse_yesno_auto() {              # varname value -> sets var to yes/no
  local __var="$1" val="$2"
  case "$val" in
    yes|no) printf -v "$__var" "%s" "$val" ;;
    auto)   if rand_bool; then printf -v "$__var" yes; else printf -v "$__var" no; fi ;;
    *) echo "Invalid value for $__var: $val" >&2; usage; exit 2 ;;
  esac
}

# --- args ---
while [[ $# -gt 0 ]]; do
  case "$1" in
    --result)         RESULT="${2:-}"; shift 2 ;;
    --result=*)       RESULT="${1#*=}"; shift ;;
    --duration)       DURATION="${2:-}"; shift 2 ;;
    --duration=*)     DURATION="${1#*=}"; shift ;;
    --print-start)    PRINT_START="${2:-}"; shift 2 ;;
    --print-start=*)  PRINT_START="${1#*=}"; shift ;;
    --print-progress) PRINT_PROGRESS="${2:-}"; shift 2 ;;
    --print-progress=*) PRINT_PROGRESS="${1#*=}"; shift ;;
    -h|--help)        usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage; exit 2 ;;
  esac
done

# --- resolve result ---
case "$RESULT" in
  success|fail) : ;;
  auto) if rand_bool; then RESULT=success; else RESULT=fail; fi ;;
  *) echo "Invalid --result: $RESULT" >&2; usage; exit 2 ;;
esac

# --- resolve duration (seconds integer) ---
if [[ "$DURATION" == "auto" ]]; then
  TOTAL_SECS="$(rand_in_range 1 100)"
elif [[ "$DURATION" =~ ^[0-9]+$ ]]; then
  TOTAL_SECS="$DURATION"
else
  echo "Invalid --duration: $DURATION" >&2; usage; exit 2
fi

# --- resolve printing flags ---
parse_yesno_auto PRINT_START   "$PRINT_START"
parse_yesno_auto PRINT_PROGRESS "$PRINT_PROGRESS"

# --- run ---
if [[ "$PRINT_START" == "yes" ]]; then
  echo "Starting job: will run for ~${TOTAL_SECS}s; expected result: ${RESULT}"
fi

if [[ "$PRINT_PROGRESS" == "yes" ]]; then
  echo -n "Working"
  for (( i=0; i<TOTAL_SECS; i++ )); do
    echo -n "."
    sleep 1
  done
  echo
else
  sleep "$TOTAL_SECS"
fi

if [[ "$RESULT" == "success" ]]; then
  [[ "$PRINT_PROGRESS" == "yes" ]] && echo "Completed successfully."
  exit 0
else
  [[ "$PRINT_PROGRESS" == "yes" ]] && echo "Failed."
  exit 1
fi
