"""Sites source fallback when the packaged workflow helper is unavailable.

Receives a short-lived repository credential via hidden stdin, never writes it.
"""
import json
import os
import subprocess
import sys
import termios

previous = None
if sys.stdin.isatty():
    previous=termios.tcgetattr(sys.stdin)
    hidden=termios.tcgetattr(sys.stdin)
    hidden[3] &= ~termios.ECHO
    termios.tcsetattr(sys.stdin,termios.TCSANOW,hidden)
print('Ready for repository credential JSON on stdin (input is hidden).',flush=True)
try:
    credential=json.loads(sys.stdin.readline())
finally:
    if previous:termios.tcsetattr(sys.stdin,termios.TCSANOW,previous)
env=os.environ.copy()
env.update({'GIT_TERMINAL_PROMPT':'0','GIT_TRACE':'0','GIT_TRACE_CURL':'0'})
env.pop('GIT_CURL_VERBOSE',None)
token=credential.get('token','')
if credential.get('auth_mode')!='work_proxy':
    env.update({'GIT_CONFIG_COUNT':'1','GIT_CONFIG_KEY_0':'http.extraHeader','GIT_CONFIG_VALUE_0':'Authorization: Bearer '+token})
branch=credential['branch']
remote=credential['remote_url']
mode=sys.argv[1]
command=['git','ls-remote',remote,'refs/heads/'+branch] if mode=='probe' else ['git','push',remote,'HEAD:refs/heads/'+branch]
result=subprocess.run(command,env=env,text=True,capture_output=True)
for output in (result.stdout,result.stderr):
    if output:print(output.replace(token,'[redacted]') if token else output,end='',flush=True)
raise SystemExit(result.returncode)
